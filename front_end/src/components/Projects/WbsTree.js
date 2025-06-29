import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useTheme, lighten } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    DndContext,
    closestCenter,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextFieldStyled from '../TextFieldStyled';
import SecondaryButton from '../Buttons/secondaryButton';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';



const DraggableItem = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const theme = useTheme();
    const style = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // space between handle and children
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <IconButton {...listeners}
                size="small"
                sx={{
                    cursor: 'grab',
                    color: theme.palette.primary.contrastText,
                }}

                aria-label="drag handle"
            ><DragIndicatorIcon />
            </IconButton>
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
};

const pathsEqual = (a, b) => a.length === b.length && a.every((val, idx) => val === b[idx]);

const countTotalNodes = (items) => {
    return items.reduce((count, item) => count + 1 + countTotalNodes(item.children || []), 0);
};

const getDepth = (path) => path.length

const WbsTree = () => {
    const [wbs, setWbs] = useState([{ id: crypto.randomUUID(), title: '', children: [], start_date: "", end_date: "" }])
    const [activeId, setActiveId] = useState(null);
    const theme = useTheme();
    // const getBackgroundColorForDepth = (depth, theme) => {
    //     const colors = [
    //         theme.palette.background.default,
    //         theme.palette.primary.main,
    //         lighten(theme.palette.background.default,0.15),
    //         lighten(theme.palette.background.default,0.25),
    //         lighten(theme.palette.background.default,0.3),
    //     ];
    //     return colors[depth % colors.length];
    // };

    useEffect(() => {
        setWbs(prev => generateWbsNumbers(prev));
    }, []);

    const generateWbsNumbers = (items, prefix = '') => {
        return items.map((item, index) => {
            const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
            return {
                ...item,
                wbsNumber: number,
                children: generateWbsNumbers(item.children || [], number),
            };
        });
    };

    const handleTitleChange = (path, value) => {
        const updateTitle = (items, currentPath = []) => {
            return items.map((item, index) => {
                const newPath = [...currentPath, index];
                if (pathsEqual(newPath, path)) {
                    return { ...item, title: value };
                }
                return {
                    ...item,
                    children: updateTitle(item.children || [], newPath),
                };
            });
        };
        setWbs(prev => generateWbsNumbers(updateTitle(prev)));
    };

    const handleStartChange = (path, value) => {
        const updateStart = (items, currentPath = []) => {
            return items.map((item, index) => {
                const newPath = [...currentPath, index];
                if (pathsEqual(newPath, path)) {
                    return { ...item, start_date: item.end_date < value ? "" : value };
                }
                return {
                    ...item,
                    children: updateStart(item.children || [], newPath),
                };
            });
        };
        setWbs(prev => generateWbsNumbers(updateStart(prev)));
    };

    const handleEndChange = (path, value) => {
        const updateEnd = (items, currentPath = []) => {
            return items.map((item, index) => {
                const newPath = [...currentPath, index];
                if (pathsEqual(newPath, path)) {
                    return { ...item, end_date: item.start_date > value ? "" : value };
                }
                return {
                    ...item,
                    children: updateEnd(item.children || [], newPath),
                };
            });
        };
        setWbs(prev => generateWbsNumbers(updateEnd(prev)));
    };

    const handleAddChild = (path) => {
        const maxDepth = 4;
        const totalLimit = 30;

        if (getDepth(path) >= maxDepth) {
            alert(`Maximum depth of ${maxDepth} levels reached.`);
            return;
        }

        if (countTotalNodes(wbs) >= totalLimit) {
            alert(`Maximum of ${totalLimit} total nodes reached.`);
            return;
        }

        const addChild = (items, currentPath = []) => {
            return items.map((item, index) => {
                const newPath = [...currentPath, index];
                if (pathsEqual(newPath, path)) {
                    return {
                        ...item,
                        children: [
                            ...(item.children || []),
                            { id: crypto.randomUUID(), title: '', children: [] },
                        ],
                    };
                }
                return {
                    ...item,
                    children: addChild(item.children || [], newPath),
                };
            });
        };

        setWbs(prev => generateWbsNumbers(addChild(prev)));
    };



    const handleDelete = (path) => {
        const deleteAtPath = (items, currentPath = []) => {
            return items.filter((_, index) => {
                const newPath = [...currentPath, index];
                return !pathsEqual(newPath, path);
            }).map((item, index) => {
                const newPath = [...currentPath, index];
                return {
                    ...item,
                    children: deleteAtPath(item.children || [], newPath),
                };
            });
        };
        setWbs(prev => generateWbsNumbers(deleteAtPath(prev)));
    };


    const findItemPath = (items, targetId, path = []) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === targetId) return [...path, i];
            if (items[i].children) {
                const result = findItemPath(items[i].children, targetId, [...path, i, 'children']);
                if (result) return result;
            }
        }
        return null;
    };

    const flatten = (items, parentId = null) => {
        return items.flatMap((item, index) => [
            { id: item.id, parentId, index, item },
            ...flatten(item.children || [], item.id),
        ]);
    };

    const moveItemWithinLevel = (items, sourceId, targetId) => {
        const updateLevel = (levelItems) => {
            const ids = levelItems.map(i => i.id);
            const sourceIndex = ids.indexOf(sourceId);
            const targetIndex = ids.indexOf(targetId);

            if (sourceIndex !== -1 && targetIndex !== -1) {
                const newLevelItems = arrayMove(levelItems, sourceIndex, targetIndex);
                return newLevelItems;
            }

            return levelItems.map(item => ({
                ...item,
                children: updateLevel(item.children || []),
            }));
        };

        return generateWbsNumbers(updateLevel(items));
    };


    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setWbs(prev => moveItemWithinLevel(prev, active.id, over.id));
        }
        setActiveId(null);
    };

    const renderTree = (items, path = []) => {
        return (
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                {items.map((item, index) => {
                    const currentPath = [...path, index];
                    return (
                        <DraggableItem key={item.id} id={item.id}>
                            <Box sx={{
                                ml: path.length * 3, borderLeft: '1px solid gray', pl: 1, mt: 1, pt:1, pb:1,
                                // backgroundColor: getBackgroundColorForDepth(path.length, theme),
                                borderRadius: 1,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" sx={{ width: '50px', color: 'primary.contrastText' }}>{item.wbsNumber}</Typography>
                                    <TextFieldStyled
                                        size="small"
                                        placeholder="Task title"
                                        value={item.title}
                                        onChange={(e) => handleTitleChange(currentPath, e.target.value)}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <TextFieldStyled label="Start Date" variant="outlined" type="date"
                                        size="small"
                                        value={item.start_date}
                                        onChange={(e) => handleStartChange(currentPath, e.target.value)}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            }
                                        }} />
                                    <TextFieldStyled label="End Date" variant="outlined" type="date"
                                        size="small"
                                        value={item.end_date}
                                        onChange={(e) => handleEndChange(currentPath, e.target.value)}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: true,
                                            }
                                        }} />
                                    <IconButton onClick={() => handleAddChild(currentPath)} size="small" disabled={(countTotalNodes(wbs) >= 30) || (getDepth(path) + 1 >= 4)}>
                                        ➕
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(currentPath)} size="small" color="error">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                {item.children && renderTree(item.children, currentPath)}
                            </Box>
                        </DraggableItem>
                    );
                })}
            </SortableContext>
        );
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}

        >
            {renderTree(wbs)}
            <SecondaryButton variant="outlined" sx={{ color: 'primary.contrastText', borderColor: 'background.default', mt: '5px' }} onClick={() => {
                const totalLimit = 30;
                if (countTotalNodes(wbs) >= totalLimit) {
                    alert(`Maximum of ${totalLimit} total nodes reached.`);
                    return;
                }
                setWbs(generateWbsNumbers([...wbs, { id: crypto.randomUUID(), title: '', children: [], start_date: "", end_date: "" }]))
            }
            }
                disabled={countTotalNodes(wbs) >= 30}>
                Add Top-Level Task
            </SecondaryButton>

            {/* <DragOverlay>
                {activeId ? (
                    <Box sx={{ padding: 1, backgroundColor: 'lightgray', border: '1px solid gray' }}>
                        Dragging {activeId}
                    </Box>
                ) : null}
            </DragOverlay> */}
        </DndContext>
    );
};

export default WbsTree;

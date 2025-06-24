import { Autocomplete, TextField } from '@mui/material';


const SearchDropdown = ({ options, value, onChange }) => {
  return (
    <Autocomplete
      options={options}
      value={value}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search or select"
          variant="outlined"
          size="small"
          color="primary"
          sx={{
            '& .MuiInputBase-root': {
              color: 'primary.contrastText', // Input text color
              backgroundColor: 'var(--mui-background-contrast)', // Or your theme background
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'button.secondary', // Default border
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light', // On hover border
            },
            '& .MuiInputLabel-root': {
              color: 'primary.contrastText', // Label color
            },
          }}
        />
      )}
       sx={{
        width: 600,
        '& .MuiAutocomplete-popupIndicator': {
          color: 'primary.contrastText', // Dropdown arrow color
        },
        '& .MuiAutocomplete-clearIndicator': {
          color: 'primary.contrastText', // Clear icon color (if used)
        },
        '& .MuiAutocomplete-option': {
          color: 'primary.contrastText', // Dropdown option text
          backgroundColor: 'var(--mui-background-contrast)',
        },
      }}
    />
  );
};

export default SearchDropdown;



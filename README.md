# i18n Properties File Comparator

A simple web-based tool to compare two `.properties` files (commonly used for internationalization/i18n) and identify missing translation keys between different locales.

## Features

- 📁 **File Selection**: Upload two `.properties` files from your local disk
- 🌍 **Locale Labels**: Specify locale identifiers for each file (e.g., en_US, es_ES)
- 🔍 **Key Comparison**: Automatically compare keys between files
- 📊 **Visual Results**: See missing keys in each file at a glance
- 📈 **Statistics**: View total keys, common keys, and missing keys
- 💻 **Client-Side Only**: All processing happens in your browser - no server needed
- 🎨 **Clean UI**: Modern, responsive interface

## How to Use

1. **Open the Application**
   - Open `index.html` in any modern web browser
   - Or use a local development server

2. **Select Files**
   - Click "Choose .properties file" for File 1
   - Click "Choose .properties file" for File 2
   - Select your `.properties` files from your computer
   - Locale information is automatically extracted from filenames

3. **Compare**
   - Click the "Compare Files" button
   - View the results showing:
     - Total keys in each file
     - Number of common keys
     - Keys missing in File 1 (present in File 2)
     - Keys missing in File 2 (present in File 1)

4. **Start Over**
   - Click "Clear & Start Over" to reset and compare new files

## .properties File Format

The tool supports standard Java `.properties` file format:

```properties
# Comments start with # or !
key1=value1
key2=value2
key.with.dots=Some value
another_key:Another value
```

**Supported formats:**
- `key=value`
- `key:value`
- Comments starting with `#` or `!`
- Empty lines (ignored)

## Example Use Cases

- **Translation Management**: Identify missing translations across different language files
- **Quality Assurance**: Ensure all locales have the same keys
- **Migration**: Compare old vs. new property files during refactoring
- **Team Collaboration**: Verify translation completeness before release

## Technical Details

- **Pure Client-Side**: Built with vanilla HTML, CSS, and JavaScript
- **No Dependencies**: No frameworks or libraries required
- **Browser Compatibility**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design**: Mobile and desktop friendly

## File Structure

```
.
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # Application logic and file parsing
└── README.md       # This file
```

## Running Locally

### Option 1: Direct File Opening
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)
Using Python:
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

Using Node.js:
```bash
npx serve

# Or with http-server
npx http-server
```

Using VS Code:
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

## Browser Requirements

- Modern browser with ES6+ support
- FileReader API support
- No special permissions needed

## Privacy

All file processing happens entirely in your browser. No files are uploaded to any server, ensuring complete privacy and security of your translation files.

## Future Enhancements

Potential features for future versions:
- Export comparison results to CSV/JSON
- Side-by-side value comparison
- Batch file comparison
- Duplicate key detection
- Support for other file formats (JSON, YAML)

## License

Free to use and modify for any purpose.

---

**Created for comparing i18n .properties files**

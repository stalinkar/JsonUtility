function generateClassFromJson(jsonObj, className = "ParentClass") {
    let classDefinition = `public class ${className} {\n`;

    let fieldDefinitions = {};
    const jsonParse = typeof jsonObj === 'object' ? jsonObj : JSON.parse(jsonObj);

    // Iterate over each key-value pair in the JSON object
    for (const key in jsonParse) {
        if (jsonParse.hasOwnProperty(key)) {
            const value = jsonParse[key];
            const fieldType = detectType(value, capitalizeFirstLetter(key));

            // Append the field definitions (properties in this case)
            classDefinition += `    private ${fieldType} ${key};\n`;

            // Store field types for getters and setters
            fieldDefinitions[key] = fieldType;
        }
    }

    classDefinition += `\n`;

    // Generate getters and setters
    for (const key in fieldDefinitions) {
        const type = fieldDefinitions[key];

        // Getter
        classDefinition += `    public ` + type + ` get${capitalizeFirstLetter(key)}() {\n`;
        classDefinition += `        return this.${key};\n`;
        classDefinition += `    }\n\n`;

        // Setter
        classDefinition += `    public void set${capitalizeFirstLetter(key)}(` + type + ` ${key}) {\n`;
        classDefinition += `        this.${key} = ${key};\n`;
        classDefinition += `    }\n\n`;
    }

    classDefinition += `}\n\n`;

    // Handle nested classes
    for (const key in jsonParse) {
        if (jsonParse.hasOwnProperty(key)) {
            const value = jsonParse[key];
            if (typeof value === 'object' && !Array.isArray(value)) {
                classDefinition += generateClassFromJson(value, capitalizeFirstLetter(key));
            } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                classDefinition += generateClassFromJson(value[0], capitalizeFirstLetter(key.slice(0, -1)));
            }
        }
    }

    return classDefinition;
}

// Helper function to detect the type of each field in the JSON
function detectType(value, nestedClassName) {
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return 'int';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'object' && !Array.isArray(value)) return nestedClassName;  // For nested objects, return class name
    if (Array.isArray(value)) {
        if (value.length === 0) return 'Array';
        return `List<${detectType(value[0], nestedClassName)}>`;  // For arrays of objects or primitives
    }
    return 'Object';  // Default type for unknown or null values
}

// Helper function to capitalize the first letter of field names or class names
function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function setCopyButtonVisible(){
    document.getElementById("copy-btn").setAttribute("style","display: block;");
}

function copyToClipboard() {
    let output = document.getElementById('output');
    output.select();
    output.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    alert("Output copied to clipboard!");
}

function getPojo() {
    setCopyButtonVisible()
    const jsonInput = document.getElementById("input").value
    document.getElementById("output").value = generateClassFromJson(jsonInput);
}
// Helper function to parse input string into parameters
export function parseInputString(inputStr: string): unknown[] {
  // Remove any whitespace at start and end
  inputStr = inputStr.trim();

  const params: unknown[] = [];

  // For each parameter (key=value pairs)
  const keyValuePairs = inputStr.split(/,\s*(?=\w+\s*=)/);

  for (const pair of keyValuePairs) {
    // Extract value after the equals sign (if present)
    let value;
    if (pair.includes('=')) {
      // Get everything after the first equals sign
      value = pair.substring(pair.indexOf('=') + 1).trim();
    } else {
      value = pair.trim();
    }

    // Parse the value based on its type
    params.push(parseComplexValue(value));
  }

  return params;
}

// Parse a complex value (array, object, or primitive)
function parseComplexValue(value: string): unknown {
  value = value.trim();

  // Handle arrays
  if (value.startsWith('[') && value.endsWith(']')) {
    return parseArray(value);
  }

  // Handle objects
  if (value.startsWith('{') && value.endsWith('}')) {
    return parseObject(value);
  }

  // Handle primitives
  return parseValue(value);
}

// Parse an array string into an actual array
function parseArray(arrayStr: string): unknown[] {
  // Remove outer brackets
  const content = arrayStr.slice(1, -1).trim();

  // Empty array
  if (content === '') {
    return [];
  }

  // Nested arrays require special handling
  if (content.includes('[') || content.includes('{')) {
    // Split by commas that are not inside nested structures
    const elements = splitByTopLevelCommas(content);
    return elements.map((element) => parseComplexValue(element.trim()));
  }

  // Simple array
  return content.split(',').map((element) => parseValue(element.trim()));
}

// Parse an object string into an actual object
function parseObject(objStr: string): unknown {
  // Remove outer braces
  const content = objStr.slice(1, -1).trim();

  // Empty object
  if (content === '') {
    return {};
  }

  try {
    // First attempt: Try to fix and parse as JSON
    const fixedStr =
      '{' +
      content
        // Fix property names without quotes
        .replace(/(\{|,)\s*([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":')
        // Fix trailing/double commas
        .replace(/,\s*,/g, ',')
        .replace(/,\s*(\}|\])/g, '$1')
        // Fix single quotes on values
        .replace(/:\s*'([^']*)'/g, ':"$1"') +
      '}';

    return JSON.parse(fixedStr);
  } catch {
    // Second attempt: Manual parsing
    const result: Record<string, unknown> = {};

    // Split the content by commas that aren't inside nested structures
    const pairs = splitByTopLevelCommas(content);

    for (const pair of pairs) {
      // Skip empty pairs (handles double commas)
      if (!pair.trim()) continue;

      // Split by the first colon
      const colonIndex = pair.indexOf(':');
      if (colonIndex === -1) continue;

      // Get key and value
      const key = pair.substring(0, colonIndex).trim();
      const value = pair.substring(colonIndex + 1).trim();

      // Clean the key (remove quotes if present)
      const cleanKey = key.replace(/^["'](.*)["']$/, '$1');

      // Parse the value
      result[cleanKey] = parseComplexValue(value);
    }

    return result;
  }
}

// Split a string by commas that are not inside brackets or braces
function splitByTopLevelCommas(str: string): string[] {
  const result: string[] = [];
  let currentPart = '';
  let bracketCount = 0;
  let braceCount = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;
    else if (char === '{') braceCount++;
    else if (char === '}') braceCount--;

    // Only split on commas at the top level
    if (char === ',' && bracketCount === 0 && braceCount === 0) {
      result.push(currentPart);
      currentPart = '';
    } else {
      currentPart += char;
    }
  }

  // Don't forget the last part
  if (currentPart) {
    result.push(currentPart);
  }

  return result;
}

// Helper function to parse different types of values
export function parseValue(value: string): unknown {
  value = value.trim();

  // Check for common types
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (value === 'undefined') return undefined;

  // Check if it's a number
  if (!isNaN(Number(value)) && value !== '') {
    return Number(value);
  }

  // Check if it's a string with quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  // Return as is for anything else
  return value;
}

#!/bin/bash

# Directory where extensions are located
EXTENSIONS_DIR=".vscode-test/extensions"

# Names of the folders to check
FOLDER1="movebit.move-msl-syx-0.0.2"
FOLDER2="movebit.move-msl-syx-0.0.2" # Note: This is the same as FOLDER1, is this intended?

# Check if both folders exist
if [ -d "$EXTENSIONS_DIR/$FOLDER1" ] && [ -d "$EXTENSIONS_DIR/$FOLDER2" ]; then
    echo "Both $FOLDER1 and $FOLDER2 already exist in $EXTENSIONS_DIR. No action taken."
else
    # Remove existing extensions directory and copy the new one
    rm -rf "$EXTENSIONS_DIR"
    cp -r ./.depend_extensions_for_test "$EXTENSIONS_DIR"
    echo "Copied test_depend_extensions to $EXTENSIONS_DIR."
fi

# Find the path of move-analyzer
move_analyzer_path=$(whereis move-analyzer | awk '{print $2}')

# Check if the path is found
if [ -z "$move_analyzer_path" ]; then
    echo "move-analyzer not found."
    exit 1
fi

# Define the path to the settings file
settings_path=".vscode-test/user-data/User/settings.json"

# Create the settings content in JSON format
settings_content="{\n  \"sui-move-analyzer.server.path\": \"$move_analyzer_path\"\n}"

# Write the settings content to the file
echo -e $settings_content > "$settings_path"

if [ $? -eq 0 ]; then
    echo "Path written to settings.json: $move_analyzer_path"
else
    echo "Error writing to settings.json"
    exit 1
fi

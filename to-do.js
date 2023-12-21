//Let forms load first before executing
document.addEventListener('DOMContentLoaded', function()
{
    const body = document.getElementById('body');// store add button element
    const addButton = document.getElementById('add-button');// store add button element
    const itemsTable = document.getElementById('to-do-table');// store div for added items
    const tableContainer = document.querySelector('.table-container');
    const clearAllBtn = document.getElementById('clear-all-button');// store clear all button

    // arrays to store order of completed items and to-complete items for re-ordering the table
    let toDoItemsArr = [];
    let completedItemsArr = [];

    // Initialize a counter variable for naming convention
    let itemCount = 0;

    // Add listener to entire body of HTML pge
    body.addEventListener('click', function(event) {
        // If "add" button is clicked, create a new row with user input within the table
        if (event.target === addButton){
            const toDoInput = document.getElementById('to-do-input');// store input field element
            let userInput = toDoInput.value;

            // call functions to create new table row, create new cell item, create edit button cell
            // create complete button cell, create delete button cell
            let newTableRow = createTableRow(itemCount);
            let newToDoCell = createTableCell(`addItem-${itemCount}`, `addItem-${itemCount}`, "to-do-item", userInput);
            let editButton = createPencilButton(itemCount);
            let saveButton = createSaveButton(itemCount);
            let newCompleteCell = createCompleteCheckbox(itemCount);
            let deleteButton = createDeleteButton(itemCount);

            // append item element, checkbox cell, delete button cell to new row element
            newTableRow.appendChild(newCompleteCell);
            newTableRow.appendChild(newToDoCell);
            newTableRow.appendChild(saveButton);
            newTableRow.appendChild(editButton);
            newTableRow.appendChild(deleteButton);

            // insert the new row element at the top of the table
            itemsTable.insertBefore(newTableRow, itemsTable.firstChild);
            // add row to array of items to complete
            toDoItemsArr.unshift(newTableRow);

            toDoInput.value = ''; // reset input field

            // Add to item counter
            itemCount++;
        }


        // if element that was clicked was a checkbox within the to do list table
        else if (event.target.type === 'checkbox') {
            handleCheckbox(event); // call function to handle checkbox being clicked
        }

        // else if element that was clicked was a edit icon within the to do list table
        else if (event.target.id.includes('edit-button')){
            handleEditButton(event); // call function to handle edit activity
        }

        // if element that was clicked was a delete icon within the to do list table
        else if (event.target.id.includes('delete-button')){
            handleDeleteButton(event); // call function to handle deletion
        }

        // if element that was clicked was a save icon within the to do list table
        else if (event.target.id.includes('save-icon')){
            handleSaveIcon(event); // call function to handle saving text
        }

        // if click was clear all button, remove all to do items if clicked
        else if (event.target === clearAllBtn){
            // While table still has rows in it, continue to loop through and delete the first row
            while (itemsTable.rows.length > 0) {
                itemsTable.deleteRow(0); // Delete the first row in each iteration
            }
            // delete all elements of the to do items array
            while (toDoItemsArr.length > 0) {
                 toDoItemsArr.pop(); // deletes last item of the array
            }

            // delete all elements of the completed items array
            while (completedItemsArr.length > 0) {
                completedItemsArr.pop();
            }
        }

        updateTableBorder(); // call updateTableBorder to show or hide border
    });

    // HELPER FUNCTIONS
    // function to create row for new to-do item
    function createTableRow(itemCount) {
        const newRow = document.createElement("tr");
        newRow.setAttribute('data-row-number', itemCount);
        newRow.id = "item-row-" + itemCount;
        return newRow;
    }

    // function to create table cell with user input of to-do item
    function createTableCell(name, id, className, userInput) {
        const newCell = document.createElement("td");
        newCell.name = name; // assign HTML name
        newCell.id = id; // assign HTML ID
        newCell.className = className; // assign HTML class name

        // Create a div to contain the content and the input field
        const contentDiv = document.createElement("div");
        contentDiv.textContent = userInput; // assign HTML Text to display
        contentDiv.id = id + "-div"
        contentDiv.style.textAlign = 'left'; // Add style to align left
        contentDiv.style.fontWeight = 'bold'; // Add style to make text bold

        // Create an input field for editing
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.id = id + "-input"
        inputField.value = userInput; // Set the initial value
        inputField.style.display = "none"; // Initially hide the input field

        // Append contentDiv, inputField, and editButton to the new cell
        newCell.appendChild(contentDiv);
        newCell.appendChild(inputField);

        return newCell;
    }

    // function to create save button
    function createSaveButton(itemCount){
        const newSaveCell = document.createElement("td"); // create new cell

        // create save button to save editing
        const saveIcon = document.createElement("i");
        saveIcon.className = 'fa-solid fa-floppy-disk';
        saveIcon.id = "save-icon-" + itemCount; // id with itemCount to know which on selected
        saveIcon.style.display = "none"; // Initially hide the icon

        // Add the cursor: pointer style
        saveIcon.style.cursor = 'pointer';

        newSaveCell.appendChild(saveIcon); // append the icon the cell
        return newSaveCell;
    }

    // function to create an edit button
    function createPencilButton(itemCount) {
        const newCell = document.createElement("td"); // create new cell
        // Create the i element
        const pencilIcon = document.createElement('i');
        pencilIcon.className = 'fa-solid fa-pencil';
        pencilIcon.id = "edit-button-" + itemCount; // id with itemCount to know which on selected

        // Add the cursor: pointer style
        pencilIcon.style.cursor = 'pointer';

        // Append the icon element to the td element
        newCell.appendChild(pencilIcon);
        return newCell;
    }

    // function to create complete checkbox to append to table row
    function createCompleteCheckbox(itemCount) {
        const newCell = document.createElement("td");

        const newCompleteCheckbox = document.createElement("input"); // element type input
        newCompleteCheckbox.type = "checkbox"; // input type checkbox
        newCompleteCheckbox.id = "complete-checkbox-" + itemCount; // id with itemCount to know which on selected
        newCompleteCheckbox.className = "complete-checkbox"; // class name for styling

        // append button element to new cell element
        newCell.appendChild(newCompleteCheckbox);

        return newCell;
    }

    // function to create a garbage bin delete button
    function createDeleteButton(itemCount) {
        const newCell = document.createElement("td");
        // Create the i element
        const garbageIcon = document.createElement('i');
        garbageIcon.className = 'fa-solid fa-trash';
        garbageIcon.id = "delete-button-" + itemCount; // id with itemCount to know which on selected

        // Add the cursor: pointer style
        garbageIcon.style.cursor = 'pointer';

        // Append the icon element to the td element
        newCell.appendChild(garbageIcon);
        return newCell;
    }

    // function to update table container appearance 
    function updateTableBorder() {
        // boolean to check if to-do table has more than one row
        const hasRows = itemsTable.querySelectorAll('tr').length > 0;
        // if more than one row is true
        if (hasRows) {
          tableContainer.style.border = '1px solid #ccc'; // Show border
        } else { // else 0 rows in the table
          tableContainer.style.border = 'transparent'; // Hide border
        }
      }

    // Function to move incomplete item to the completed list
    function moveItem(row, isCompleted) {
        // if item is being moved to completed
        if (!isCompleted){
            // remove the row from the incomplete items array, using index of the row clicked, 1 specifies delete one element
            toDoItemsArr.splice(toDoItemsArr.indexOf(row), 1);
            completedItemsArr.unshift(row); // add row to the completed items at the top of the list
            row.classList.add('completed'); // add the 'completed' tag to the row
        }
        else { // item is being back to incomplete
            // remove the row from the complete array, using index of the row clicked, 1 specifies delete one element
            completedItemsArr.splice(completedItemsArr.indexOf(row), 1);
            toDoItemsArr.push(row); // re-add row back to the to-do items
            row.classList.remove('completed'); // remove the 'completed' tag
        }
    }

    // function to remove all the rows of the table and append back to page in new order
    function updateTable(){
        // Remove all the completed rows from their current positions
        while (itemsTable.rows.length > 0) {
            itemsTable.deleteRow(0);
        }

        // Append the incomplete items in the current order from array
        toDoItemsArr.forEach(function(row) {
            itemsTable.appendChild(row);
        });

        // Append the complete items in the current order from array
         completedItemsArr.forEach(function(row) {
             itemsTable.appendChild(row);
         });
    }

    // Function to pass event and return the row from the to do table that was clicked
    function parseRowID(buttonClickedID){
        // Regular expression to extract the numeric part of the ID used to identify which row was clicked
        let itemCount = parseInt(buttonClickedID.match(/\d+/)[0], 10);
        // Get the parent row of the clicked button
        let rowClicked = document.getElementById("item-row-" + itemCount);

        return rowClicked;
    }

    // Function to handle complete checkbox being clicked to strikethrough and move it
    function handleCheckbox(event){
        // Call function to get row that was clicked and store id of the row
        let rowClicked = parseRowID(event.target.id);

        // Toggle the strikethrough font for the text of the row
        rowClicked.classList.toggle('strikethrough');

        // Code to rearrange completed and incomplete items in the table accordingly
        // store if the row that was clicked doesn't contain "completed" (is incomplete)
        let isCompleted = rowClicked.classList.contains('completed');
        // call function to move item to completed in incomplete array accordingly
        moveItem(rowClicked, isCompleted);

        // call function to update and reposition table
        updateTable();
    }

    // Function to handle event of edit button being clicked to allow editing of row
    function handleEditButton(event){
        // store id of the row clicked
        let rowClickedID = event.target.id;
        // Regular expression to extract the numeric part of the ID used to identify which row was clicked
        let itemCount = parseInt(rowClickedID.match(/\d+/)[0], 10);

        const divElement = document.getElementById(`addItem-${itemCount}-div`);
        const inputElement = document.getElementById(`addItem-${itemCount}-input`);
        const saveIcon = document.getElementById(`save-icon-${itemCount}`);

        // Manipulate the div and input elements as needed
        divElement.style.display = 'none'; // Hide the div
        saveIcon.style.display = 'block'; // Show save icon
        inputElement.style.display = 'block'; // Show the input

        // Add an event listener to the input field to save changes on blur
        inputElement.addEventListener('blur', function () {
            divElement.textContent = inputElement.value; // Update the content with the input value
            divElement.style.display = "block"; // Show the content
            inputElement.style.display = "none"; // Hide the input field
            saveIcon.style.display = "none"; // Hide the input field
        });
    }

    // function to handle event when delete button is clicked to delete row and items from arrays
    function handleDeleteButton(event){
        // Call function to get row that was clicked and store id of the row
        let deleteRowClicked = parseRowID(event.target.id);
        // boolean variable to assess if item was found in array
        let rowFound = false;

        // Delete item from corresponding array
        // loop through array to find row to delete
        for (let i = 0; i < toDoItemsArr.length; i++){
            // if row to delete equals current item in array
            if (deleteRowClicked === toDoItemsArr[i]){
                // delete row clicked from array using splice method and index of row clicked
                toDoItemsArr.splice(toDoItemsArr.indexOf(deleteRowClicked), 1);
                rowFound = true; // set boolean to true
                break; // break loop
            }
        }

        if (rowFound === false){
            // loop through array to find row to delete
            for (let i = 0; i < completedItemsArr.length; i++){
                // if row to delete equals current item in array
                if (deleteRowClicked === completedItemsArr[i]){
                    // delete row that was clicked from array using splice method and index of clicked row
                    completedItemsArr.splice(completedItemsArr.indexOf(deleteRowClicked), 1);
                    rowFound = true; // set boolean to true
                    break; // break loop
                }
            }
        }

        // Check if the row exists
        if (deleteRowClicked) {
            // Delete the row
            deleteRowClicked.parentNode.removeChild(deleteRowClicked);
        }
    }

    // Function to handle save icon being clicked
    function handleSaveIcon(event){
        // store id of the row clicked
        let rowClickedID = event.target.id;
        // Regular expression to extract the numeric part of the ID used to identify which row was clicked
        let itemCount = parseInt(rowClickedID.match(/\d+/)[0], 10);

        const divElement = document.getElementById(`addItem-${itemCount}-div`);
        const inputElement = document.getElementById(`addItem-${itemCount}-input`);
        const saveIcon = document.getElementById(`save-icon-${itemCount}`);

        divElement.textContent = inputElement.value; // Update the content with the input value
        divElement.style.display = "block"; // Show the content
        inputElement.style.display = "none"; // Hide the input field
        saveIcon.style.display = "none"; // Hide the input field
    }
});
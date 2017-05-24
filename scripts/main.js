(function(){  

    var STATUS_TODO = 0;
    var STATUS_DOING = 1;
    var STATUS_DONE = 2;
    
    function buildToDoPage (title, entries) {
              
        var $newEntryInputWrapper  = $("<div>").addClass("col"),
            $newEntryTable         = $("<ul>").addClass("table item-list"),
            $figureElement         = $("<figure>").addClass("img-wrapper"),
            $newEntryForm          = $("<form>"),
            $mainElement           = $("<main>").addClass("main-wrapper"),
            $itemList              = $("ul .item-list").clone().addClass("table entry-list"),
            $section1              = $("<section>").addClass("header-wrapper container col-md-5 col-md-offset-4"),
            $section2              = $("<section>").addClass("main-content container col-md-5 col-md-offset-4"),
            $header                = $("<header>").addClass("header text-primary-color"),
            $addBtn                = $("<button>").addClass("plus-button").attr("type", "submit"),
            $newEntryRow           = $("<li>").addClass("row light-primary-color"),
            $imgElement            = $("<div>").addClass("header-icon fa fa-plus-circle").attr({

                                        src : "../images/plus-4-48.png",
                                        alt : "Plus one"

                                    }),
            $textInput             = $("<input>").addClass("new-entry seamless").attr({
                            
                                        name: "message",
                                        autofocus: "autofocus",
                                        autocomplete: "off",
                                        placeholder: "Enter a new note"
                                    
                                    }),
            $h1Element             = $("<h1>").text(title),
            $newEntryButtonWrapper = $newEntryInputWrapper.clone().addClass("col new-entry-btn-wrap");

            $newEntryInputWrapper.addClass("new-item-list");

            $figureElement.append($imgElement);
            $addBtn.append($figureElement);
            $newEntryInputWrapper.append($textInput);
            $newEntryButtonWrapper.append($addBtn);
            $newEntryRow.append([$newEntryInputWrapper, $newEntryButtonWrapper]);
            $newEntryTable.append($newEntryRow);
            $newEntryForm.append([$newEntryTable, $itemList]);
            $header.append($h1Element);
            $section1.append($header);
            $section2.append($newEntryForm);
            $mainElement.append([$section1, $section2]);
            $newEntryButtonWrapper = $newEntryInputWrapper.clone().addClass("col new-entry-btn-wrap"),
            
            $("body").append($mainElement);
            
              debugger;
    }

//  function buildToDoPage (title, entries) {
//        var figureElement = document.createElement("figure"),
//            textInput = document.createElement("input"),
//            mainElement = document.createElement("main"),
//            section1 = document.createElement("section"),
//            section2 = document.createElement("section"),
//            section3 = document.createElement("section"),
//            imgElement = document.createElement("div"),
//            header = document.createElement("header"),
//            addBtn = document.createElement("button"),
//            h1Element = document.createElement("h1"),
//            newEntryTable = document.createElement("ul"),
//            content = document.createTextNode(title),
//            newEntryInputWrapper = document.createElement("div"),
//            newEntryForm = document.createElement("form"),
//            newEntryRow = document.createElement("li"),
//            
            // itemList,
//            newEntryButtonWrapper;
//
//            -newEntryTable.classList.add( "table", "item-list");
//            -addBtn.classList.add("plus-button");
//            -mainElement.classList.add( "main-wrapper");
//            -section1.classList.add("header-wrapper", "container", "col-md-5", "col-md-offset-4");
//            -section2.classList.add("main-content", "container", "col-md-5", "col-md-offset-4");
//            -section3.classList.add("main-content", "container", "col-md-5", "col-md-offset-4");
//            -header.classList.add("header", "text-primary-color");
//            -newEntryRow.classList.add("row", "light-primary-color");
//            -figureElement.classList.add("img-wrapper");
//            -imgElement.classList.add("header-icon", "fa",  "fa-plus-circle");
//            -textInput.classList.add("new-entry", "seamless");
//            -newEntryInputWrapper.classList.add("col");
//            
//            
//            -textInput.setAttribute("name", "message");
//            -textInput.setAttribute("autofocus", "autofocus");
//            -textInput.setAttribute("autocomplete", "off");
//            -textInput.setAttribute("placeholder", "Enter a new note");
//            -addBtn.setAttribute("type", "submit");
////          -imgElement.setAttribute("src", "../images/plus-4-48.png");
//            -imgElement.setAttribute("alt", "Plus one");
//
//            -newEntryButtonWrapper = newEntryInputWrapper.cloneNode(true);
//            -newEntryButtonWrapper.classList.add("new-entry-btn-wrap");
//            -itemList = newEntryTable.cloneNode(true);
//            -itemList.classList.add( "table", "entry-list");
//            -newEntryTable.classList.add( "new-item-list");
//            
//            -figureElement.appendChild(imgElement);
//            -addBtn.appendChild(figureElement);
//            -newEntryInputWrapper.appendChild(textInput);
//            -newEntryButtonWrapper.appendChild(addBtn);
//            -newEntryRow.appendChild(newEntryInputWrapper);
//            -newEntryRow.appendChild(newEntryButtonWrapper);
//            -h1Element.appendChild(content);
//            -header.appendChild(h1Element);
//            -newEntryTable.appendChild(newEntryRow);
//            -newEntryForm.appendChild(newEntryTable);
//            
//            -section1.appendChild(header);
//            -section2.appendChild(newEntryForm);
//            -section2.appendChild(itemList);
//            -mainElement.appendChild(section1);
//            -mainElement.appendChild(section2);
//
//            -document.body.appendChild(mainElement);
//            
//  } 

    function buildATodoList(dataArray){
    
        var ulElement = document.querySelector(".entry-list"),
            row;

        for (var i = 0; i < dataArray.length; i += 1) {

            var todoItem = dataArray[i];

            row = createToDoListItem(todoItem);

            ulElement.appendChild(row);  
            
        }
    
    }
    
    function createToDoListItem (todoItem) {
        
        var checkElement,
            deleteElement,
            deleteColumn,
            editElement,
            editColumn,
            checkColumn,
            column,
            row,
            todoMessage,
            listText;
        
        row = document.createElement("li");       
        listText = document.createTextNode(todoItem.message);
        checkElement = document.createElement("button");
        deleteElement = document.createElement("button");
        editElement = document.createElement("button");
        column = document.createElement("div");
        todoMessage = document.createElement("span");

        row.classList.add("row", "light-primary-color");
        column.classList.add("col");
        todoMessage.classList.add("item-message");
        row.setAttribute("item-id", todoItem.id);
        row.setAttribute("item-status", todoItem.status);
        checkElement.classList.add("fa", "fa-check-square-o", "fa-lg", "check-item", "action-item");
        deleteElement.classList.add( "fa", "fa-times", "fa-lg", "delete-item", "action-item");
        editElement.classList.add( "fa", "fa-pencil", "fa-lg", "edit-item", "action-item");
        checkElement.setAttribute("type", "button");
        deleteElement.setAttribute("type", "button");
        editElement.setAttribute("type", "button");

        checkColumn = column.cloneNode(true);
        checkColumn.classList.add("action");
        deleteColumn = checkColumn.cloneNode(true);
        editColumn = checkColumn.cloneNode(true);

        todoMessage.appendChild(listText);
        column.appendChild(todoMessage);
        checkColumn.appendChild(checkElement);
        deleteColumn.appendChild(deleteElement);
        editColumn.appendChild(editElement);
        row.appendChild(checkColumn);
        row.appendChild(column);
        row.appendChild(editColumn);
        row.appendChild(deleteColumn);
        
        if (todoItem.status === STATUS_DONE) {
                
            row.classList.add("checked");

        }
        
        return row;
        
    }
    
    function markedItem(btn){

        var row = btn.parentNode.parentNode, 
            id = row.getAttribute("item-id"),
            status = parseInt(row.getAttribute("item-status"), 10),
            payload = {
                id: id,
                status: status === STATUS_DONE 
                        ? STATUS_TODO 
                        : STATUS_DONE 
            };
             
        xhrPatch("/entries", payload, function (error){

            if (error) {
                
                return alert(error);
                
            }
            
            if (payload.status === STATUS_DONE) {

                row.classList.add("checked");
                
            }
            else {

                row.classList.remove("checked");
                
            }
            
            row.setAttribute("item-status", payload.status);
           
         
        });
    
    }
    
    /* Update the delete function
     * 
     * @param {type} btn
     * @returns {undefined}
     */
     function deleteItem(btn){

        var row = btn.parentNode.parentNode, 
            id = row.getAttribute("item-id"),
            payload = {
                id: id
            };
             
        xhrDelete("/entries", payload, function (error){

            if (error) {
                
                return alert(error);
                
            }
            
            row.parentNode.removeChild(row);
           
         
        });

    }
    
    function editItem (message) {

        if (message.style.display !== "none") {
            
            var updateEntryField = document.createElement("input");
        
            updateEntryField.classList.add("seamless", "editing");
            updateEntryField.value = message.firstChild.nodeValue;
            updateEntryField.addEventListener("blur", onItemBlurred, false);
            message.parentNode.appendChild(updateEntryField);
            message.style.display = "none";

            putCaretInFront(updateEntryField);
            
        }
        
    }
    
    function saveEditItem (input) {
        
         var row = input.parentNode.parentNode,
             id = row.getAttribute("item-id"),
            payload = {
                id: id,
                message: input.value
            };
           
        
        xhrPatch("/entries", payload, function (error){
            
            if (error) {
                
                return alert(error);
                
            }
            
            var text = document.createTextNode(payload.message);
            var message = row.querySelector(".item-message");
                  
            input.removeEventListener("blur", onItemBlurred, false);
            input.parentNode.removeChild(input);
            message.removeChild(message.firstChild);
            message.appendChild(text);
                            
            message.style.display = "";
            
        });  

    }
          
    function handleKeyup (e) {
        
        if(e.which === 13) {
            
            document.querySelector(".new-entry").focus();
            
        }
        
    }
    
    function putCaretInFront (input){
        
        // http://stackoverflow.com/questions/2127221/move-cursor-to-the-beginning-of-the-input-field
        if (input.createTextRange) {
            
            var part = input.createTextRange();
            part.move("character", 0);
            part.select();
            
        }
        else if (input.setSelectionRange){
            
            input.setSelectionRange(0, 0);
            
        }
        
        input.focus();
        
        
    }
    
    function onItemBlurred(e){
        
        if (e.target.classList.contains("editing")){
             
            saveEditItem(e.target);

        }
        
    }
    
    
      // Attachings all relevant DOM event handlers here
      
    function bindEvents () {
       
        document.getElementsByTagName("form")[0]
                .addEventListener("submit", formSubmitHandler, false);

        document.querySelector("main")
                .addEventListener("click", handleItemClick, false);
        
        document.querySelector("main")
                .addEventListener("dblclick", handleItemDblClick, false);
        
        document.querySelector("main")
                .addEventListener("keyup", handleKeyup, false);
        
    }

     function formSubmitHandler (e) {
        
        e.preventDefault();

        var form = this,
            input = form.querySelector(".new-entry"),
            payload = {message: input.value};

        if (payload.message.trim() === "") {
            
            return;
            
        }

        xhrPost("/entries", payload, function(error, newEntry){
            
            if (!error) {

                var todoItem = JSON.parse(newEntry);

                document.querySelector(".entry-list").
                        insertBefore(createToDoListItem(todoItem), 
                        document.querySelector(".entry-list").firstChild
                );
                
                input.value = "";
            }
            else  {
                
                alert(error + " try again");
            
            }
                
        });
        
     }
        
    function handleItemClick (e){

        if (e.target.classList.contains("delete-item")){

            //the delete button was clicked
            deleteItem(e.target);

        }
        else if (e.target.classList.contains("check-item")){

            //the delete button was clicked
            markedItem(e.target);

        }
        else if (e.target.classList.contains("edit-item")){

            //the edit button was clicked
            
            // fin the message
            var message = e.target.parentNode.parentNode.querySelector(".item-message");
            
            editItem(message);

        }
        
    }
   
    function handleItemDblClick (e){

        if (e.target.classList.contains("item-message")){

            //the edit button was clicked
            editItem(e.target);

        }

    }
   
   
    $(document).ready(function () {
        debugger;
        $.getJSON("../server/data.json", function (data) {
           console.log(data);
              buildToDoPage("TODO list!", data);
//            buildATodoList(data);
//            bindEvents();
//            
        });
        
    }, /*propagate*/ false);
 
})();

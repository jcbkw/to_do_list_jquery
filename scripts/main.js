$(function(){  

    var STATUS_TODO = 0;
    var STATUS_DOING = 1;
    var STATUS_DONE = 2;
    var templates = {};
    
    function buildToDoPage (title, entries) {

        var $main = $(templates.layout);
            $main.find("h1").text(title);

       $("body").append($main);

 }

    function buildATodoList (dataObject) {
        
            var $ulElement = $(".entry-list"),
                $row = $(templates.row);

        $.each(dataObject, function (i, note) {

            $ulElement.append(createToDoListItem(note, $row));

        });

    }
    
    function createToDoListItem (todoItem, $rowTemplate) {
        
         var $newRow = $rowTemplate.clone()
                                    .attr({
                                        
                                        "item-id" : todoItem.id, 
                                        "item-status" : todoItem.status
                                    });
            
         $newRow.find("span").text(todoItem.message);

        if (todoItem.status === STATUS_DONE) {
                
            $newRow.addClass("checked");

        }
        
        return $newRow;
        
    }
    
    /** Standard jQuery AJAX request
     * 
     * @param {*} url 
     * @param {*} method 
     * @param {*} data 
     * @param {*} callback 
     */
    
    function ajaxRequest(url, method, data, callback){

        $.ajax({

            url: url,
            type: method,
            data: data,
            success: callback

        }) 

    }


    function markedItem($btn){

        var $row = $btn.closest(".row"), 
            $id = $row.attr("item-id"),
            status = parseInt($row.attr("item-status"), 10),
            payload = {
                id: $id,
                status: status === STATUS_DONE 
                        ? STATUS_TODO 
                        : STATUS_DONE 
            };
             
        ajaxRequest("/entries", "PATCH", payload,
                            function (request, status) {

            if (status === "error") {
                
                return alert(status);
                
            }
            
            if (payload.status === STATUS_DONE) {

                $row.addClass("checked");
                
            }
            else {

                $row.removeClass("checked");
                
            }
            
            $row.attr("item-status", payload.status);
         
        });
    
   }

    /* Update the delete function
     * 
     * @param {type} btn
     * @returns {undefined}
     */
     function deleteItem(btn){

        var $row = $(btn).closest(".row"); 
            id = $row.attr("item-id"),
            payload = {
                id: id
            };
        ajaxRequest("/entries", "DELETE", payload, 
                            function (request, status){

                        if (status === "error") {
                            
                            return alert(status);
                            
                        }
                    })
                
        $row.remove();
         
    }
    
    function editItem ($message) {


        if ($message.css("display") !== "none") {
            
            var $updateEntryField = $("<input type='text'>").addClass("seamless editing")
                                                .val($message.text())
                                                .blur(onItemBlurred);
            $message.parent().append($updateEntryField);
            $message.css("display", "none");

            putCaretInFront($updateEntryField.get(0));
            
        }
        
    }
    
    function saveEditItem (input) {
        
         var $input = $(input), 
             $row = $input.closest(".row"),
             $id = $row.attr("item-id"),
             payload = {
                id: $id,
                message: $input.val()
             };
           
        
        ajaxRequest("/entries", "PATCH", payload, 
                            function (result, status){
            
            if (status === "error") {
                
                return alert(status);
                
            }
            
            $input.remove();
            
            $row.find(".item-message")
                 .text(payload.message)
                 .css("display", "");
            
        });  

    }
          
    function handleKeyup (e) {
        
        if(e.which === 13) {
            
            $(document).find(".new-entry").focus();
            
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
        
        if ($(e.target).hasClass("editing")){
             
            saveEditItem(e.target);

        }
        
    }
    
    
      // Attachings all relevant DOM event handlers here
      
    function bindEvents () {
       
        $("form").on("submit", formSubmitHandler);

        $("main").on("click", ".delete-item", onDeleteButtonClick)
                 .on("click", ".edit-item", onEditButtonClick)
                 .on("click", ".check-item", onCheckboxClick)
                 .on("dblclick", handleItemDblClick)
                 .on("keyup", handleKeyup);
        
    }

     function formSubmitHandler (e) {
        
        e.preventDefault();

        var $input = $(this).find(".new-entry");
        
            payload = {message: $input.val()};

        if (payload.message.trim() === "") {
            
            return;
            
        }

        $.post("/entries", payload, function(result, status){

             if (status === "success") {

                var $newEntry = createToDoListItem(result);

                $(".entry-list").prepend($newEntry);
                
                $input.val("");
            }
            else  {
                
                alert(" try again");
            
            }
                
        }, );
        
     }
        
    function onCheckboxClick (e){

        markedItem($(e.target));

    }

    function onDeleteButtonClick (e) {

        if (confirm("Really delete?")) {

            deleteItem($(e.target));
        
        }

    }

    function onEditButtonClick (e) {

        editItem($(e.target).closest(".row").find(".item-message"));
            
    }
   
    function handleItemDblClick (e){
        var $eventTarget = $(e.target);
        if ( $eventTarget.hasClass("item-message")){
  
            //the edit button was clicked
            editItem($eventTarget);

        }

    }
   
    /**
     * loads the templates at the given urls and
     * returns the results as a JavaScript object.
     *  
     * @param {string[]} urls The urls array
     * @param {function(templates: object)} callback the function to call when done
     */
    // getTemplates('templates/', ['layout', 'row'], function (tpls) {
    //
    //  console.dir(tpls);
    //  {
    //     "layout" : "<main ...",
    //     "row" : "<li ..."
    //  }
    //  
    // });
    function getTemplates (path, names, callback) {

         var index = -1,
             templateMap = {};

        function loop (name) { 

            $.get(path + name + ".html", function (html, status) {

                templateMap[name] = status === "success" ? html : null;
                next();
                
            });

        }

        function next () {
            
            index += 1;

            if (index < names.length) {

                loop(names[index]);

            }           
            else {

                callback(templateMap);
                
            }

        }

        next();

    
  }
    
    $.getJSON("/entries", function (entries) {
        
        getTemplates('templates/', ['layout', 'row'], function (tpls) {

            templates = tpls;

            buildToDoPage("TODO list!", entries);            
            buildATodoList(entries);
            bindEvents();
        
        });

    });
      
});

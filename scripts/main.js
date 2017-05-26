(function(){  

    var STATUS_TODO = 0;
    var STATUS_DOING = 1;
    var STATUS_DONE = 2;
    var $template;
    
    function buildToDoPage (title, entries) {
        var $main;
        
        $template = $("[template]").remove();
        $template.find("h1").text(title);
        $main = $template.find(".main-wrapper");
        $("body").append($main);

 }

    function buildATodoList(dataObject){
    
        var ulElement = $(".entry-list"),
            modelRow = $template.find(".row"),
            row;

            $.each(dataObject, function (i, note) {

                row = createToDoListItem(note);

            ulElement.append(row);
            
        });
    
    }
    
    function createToDoListItem (todoItem) {
        
          var $newRow = $template.find(".row")
                                 .clone()
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
    
    function ajaxDefaultRequest(url, method, data, callback){

        $.ajax({

            url: url,
            type: method,
            data: data,
            success: callback

        }) 

    }


    function markedItem(btn){

        var $row = $(btn).closest(".row"), 
            $id = $row.attr("item-id"),
            status = parseInt($row.attr("item-status"), 10),
            payload = {
                id: $id,
                status: status === STATUS_DONE 
                        ? STATUS_TODO 
                        : STATUS_DONE 
            };
             
        ajaxDefaultRequest("/entries", "PATCH", payload,
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
        ajaxDefaultRequest("/entries", "DELETE", payload, 
                            function (request, status){

                        if (status === "error") {
                            
                            return alert(status);
                            
                        }
                    })
                
        $row.remove();
         
    }
    
    function editItem (message) {


        if ($(message).css("display") !== "none") {
            
            var $updateEntryField = $("<input type='text'>").addClass("seamless editing")
                                                .val(message.text())
                                                .blur(onItemBlurred);
            $(message).parent().append($updateEntryField);
            $(message).css("display", "none");

            putCaretInFront($updateEntryField.get(0));
            
        }
        
    }
    
    function saveEditItem (input) {
        
         var $row = $(input).closest(".row"),
             $id = $row.attr("item-id"),
             payload = {
                id: $id,
                message: $(input).val()
             };
           
        
        ajaxDefaultRequest("/entries", "PATCH", payload, 
                            function (result, status){
            
            if (status === "error") {
                
                return alert(status);
                
            }
            
            var text = payload.message;
            var $message = $row.find(".item-message");
                  
            $(input).remove();
            $message.text(text);
                            
            $message.css("display", "");
            
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

        $("main").on("click", handleItemClick);
        
        $("main").on("dblclick", handleItemDblClick);
        
        $("main").on("keyup", handleKeyup);
        
    }

     function formSubmitHandler (e) {
        
        e.preventDefault();

        var $input = $(this).find(".new-entry");
        
            payload = {message: $input.val()};

        if (payload.message.trim() === "") {
            
            return;
            
        }

        $.post("/entries", payload, function(result, status, xhr){

             if (status === "success") {

                var $newEntry = createToDoListItem(result);

                $(".entry-list").prepend($newEntry);
                
                $input.val("");
            }
            else  {
                
                alert(error + " try again");
            
            }
                
        }, );
        
     }
        
    function handleItemClick (e){
       

        if ($(e.target).hasClass("delete-item")){

            //the delete button was clicked
            deleteItem($(e.target));

        }
        else if ($(e.target).hasClass("check-item")){

            //the complete button was clicked
            markedItem($(e.target));

        }
        else if ($(e.target).hasClass("edit-item")){

            //the edit button was clicked
            
            // fin the message
            var message = $(e.target).closest(".row").find(".item-message");
            //may need to add a conditional statement if e.target display is
            // none 
            editItem(message);

        }
        
    }
   
    function handleItemDblClick (e){

        if ( $(e.target).hasClass("item-message")){

            //the edit button was clicked
            editItem(e.target);

        }

    }
   
   
    $(document).ready(function () {
        $.getJSON("/entries", function (data) {
              buildToDoPage("TODO list!", data);
              buildATodoList(data);
              bindEvents();
//            
        });
        
    }, /*propagate*/ false);
 
})();

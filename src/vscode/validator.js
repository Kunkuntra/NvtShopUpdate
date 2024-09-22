//đối tượng => thành constructor function
validator = function(option) {
    var formElement = document.querySelector(option.form);
    
    //Sự kiện Submit
    if(formElement){
        formElement.onsubmit = function(e){
            e.preventDefault(); // là bỏ đi hành vi mặc định của submit
            
            var isFormValid = true;

            // thực hiện lặp qua từng rule và validate luôn
            option.rules.forEach((rule)=>{
                if(Array.isArray(selectorRules[rule.e])){
                    selectorRules[rule.e].push(rule.test)  // nếu là mảng thì push(add) thêm phần tử vào mảng
                }else{
                    selectorRules[rule.e] = [rule.test]; //lần đầu chạy qua một key mới sẽ tạo 1 mảng và gán ptu đầu tiên là chính nó
                }
                var inputElement = formElement.querySelector(rule.e);
                var isValid = validate(inputElement, rule)
                if(!isValid){
                    isFormValid = false;
                }
            })
            if (isFormValid){
                //console.log('không có lỗi')
                if(typeof option.onSubmit === 'function'){
                    
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                    var formValues = Array.from(enableInputs).reduce(function(values,input){
                        // console.log(input.name, input.value)
                        switch (input.type) {
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value)
                                break;
                                
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                                break;
                                
                            case 'file':
                                values[input.name] = input.files
                                break;
                            default:
                                values[input.name] = input.value
                                break;
                        }
                        return values;    
                    },{})

                    option.onSubmit(formValues)
                }

            }else{
                console.log('có lỗi')
            }
        }
    }
   
   
    var selectorRules = {}  

    validate = function(inputElement, rule){
        

        // Hàm lấy ra thẻ cha 
        getParent = function(element,selector){
            while(element.parentElement){
                if(element.parentElement.matches(selector)){
                    return element.parentElement
                }
                element = element.parentElement;
            }
        }
        
        // lấy value inputElement.value
        //lấy rule rule.test
        // var errorMessage =   (inputElement.value)
        var errorMessage
        //var errorElement = inputElement.parentElement.querySelector(option.erorrSelector)         // cách này chỉ dùng khi các thẻ label, input, span ở cùng cấp
        var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.erorrSelector)
        
        var rules = selectorRules[rule.e]  //biến rules này sẽ lấy ra được các rule của object 'selectorRules' là array có key là rule.e 
        //console.log(rules)   // lấy ra đc array rule
        //console.log(inputElement.value)  // lấy được giá trị nhập vào
    
        //lặp qua array rule của key và gán errorMessage
        for( var i = 0; i < rules.length; i++){
        //    console.log(rules[i](inputElement.value))  // láy được message thông báo
        //    console.log(rules[i])   // lấy được funtion của rule
            
            switch(inputElement.type){
                case 'radio':
                case 'checkbox':    
                    errorMessage = rules[i](
                        formElement.querySelector(rule.e + ':checked')
                    )
                    break;
                default:
                    errorMessage = rules[i](inputElement.value) // i là thứ tự trong array, inputElement.value là lấy ra key cho array
            }
            
            
            if(errorMessage) break
        }
    
        if(errorMessage){
            errorElement.innerText = errorMessage
            getParent(inputElement, option.formGroupSelector).classList.add('invalid')
        }else{
            errorElement.innerText =''
            getParent(inputElement, option.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage;
    }

    if(formElement){
        option.rules.forEach((rule)=>{

            //Lưu lại các rules cho mỗi input

            // lưu các rules thành các Array, nếu chưa là array thì sẽ tạo ra array mới
            // các rule có key giống nhau sẽ lưu chung vào một array
            if(Array.isArray(selectorRules[rule.e])){
                selectorRules[rule.e].push(rule.test)  // nếu là mảng thì push(add) thêm phần tử vào mảng
            }else{
                selectorRules[rule.e] = [rule.test]; //lần đầu chạy qua một key mới sẽ tạo 1 mảng và gán ptu đầu tiên là chính nó
            }

            var inputElements = formElement.querySelectorAll(rule.e);
            Array.from(inputElements).forEach(function(inputElement){
    
                //xử lý khi blur ra ngoài
                inputElement.onblur = function(){ 
                    validate(inputElement, rule)
                }

                //Xử lý khi nhập
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.erorrSelector)
                    errorElement.innerText =''
                    getParent(inputElement, option.formGroupSelector).classList.remove('invalid')  
                }
            })
        })
    }

}

//Định nghĩa rules
validator.isRequired = function(e, notify){
    return{
        e: e,
        test: function(value){
            return value ? undefined : notify || 'Vui lòng nhập trường này'   // trim để xóa dấu cách đầu cuối
        }
    }
}

validator.isEmail = function(e, notify){
    return{
        e: e,
        test: function(value){
            var regax = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regax.test(value) ? undefined : notify || 'Trường này phải là email'
        }
    }
}

validator.minLenght = function(e, min, notify){
    return{
        e: e,
        test: function(value){
            return value.length >= min ? undefined : notify || `Vui lòng nhập tối thiểu ${min} kí tự `   // trim để xóa dấu cách đầu cuối
        }
    }
}

validator.isConfirmed = function(e, getConfirmValue, notify){
    return{
        e: e,
        test: function(value){
            return value === getConfirmValue() ? undefined : notify || `Giá trị nhập lại không chính xác `
        }
    }
}

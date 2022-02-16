// $(document).ready(function() {
// $('#password').keyup(function() {
// $('#result').html(checkStrength($('#password').val()))
// })
// function checkStrength(password) {
// var strength = 0
// if (password.length < 6) {
// $('#result').removeClass()
// $('#result').addClass('short')
// return 'Too short'
// }
// if (password.length > 7) strength += 1
// // If password contains both lower and uppercase characters, increase strength value.
// if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
// // If it has numbers and characters, increase strength value.
// if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
// // If it has one special character, increase strength value.
// if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// // If it has two special characters, increase strength value.
// if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
// // Calculated strength value, we can return messages
// // If value is less than 2
// if (strength < 2) {
// $('#result').removeClass()
// $('#result').addClass('weak')
// return 'Weak'
// } else if (strength == 2) {
// $('#result').removeClass()
// $('#result').addClass('good')
// return 'Good'
// } else {
// $('#result').removeClass()
// $('#result').addClass('strong')
// return 'Strong'
// }
// }
// });

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector("#password").addEventListener("keyup", function(){
        document.querySelector("#result").innerHTML = checkStrength(document.getElementById("password").value);
    })
    function checkStrength(password){
        var strength = 0;
        if (password.length < 6){
            document.querySelector("#result").classList.remove();
            document.querySelector("#result").classList.add("short");
        }
        if(password.length > 7){
            strength += 1;
        }
        if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
            strength += 1;
        }
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){
            strength += 1;
        }
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
            strength += 1;
        }
        if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)){
            strength += 1;
        }
        console.log("Strength: " + strength + "Password: " + password);
        if(strength < 2){
            document.querySelector("#result").classList.remove();
            document.querySelector("#result").classList.add("weak");
            return "Weak";
        }
        else if(strength == 2){
            document.querySelector("#result").classList.remove();
            document.querySelector("#result").classList.add("good");
            return "Good";
        }
        else{
            document.querySelector("#result").classList.remove();
            document.querySelector("#result").classList.add("strong");
            return "Strong";
        }
    }
})
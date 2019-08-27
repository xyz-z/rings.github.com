var countdown=60;
function settime(obj) {
    if (countdown == 0) {
        obj.removeAttribute("disabled");
        obj.value="发送验证码";
        countdown = 60;
        return;
    } else {
        obj.setAttribute("disabled", true);
        obj.value="重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function() {
            settime(obj) }
        ,1000)
}

$(function(){
    $("#loginbtn").click(function(){
        var phoneNumber = $("#phoneNumber");
        var validateCode = $("#validateCode");
        var mima = $("#mima");
        var msg = "";

        if(phoneNumber.val() === ""){
            msg = "手机号码不能为空!";
            phoneNumber.focus();

        }else if(validateCode.val() === ""){
            msg = "验证码不能为空!";
            validateCode.focus();

        }else if(mima.val() === ""){
            msg = "密码不能为空!";
            mima.focus();
        }
        if(msg !== ""){
            alert(msg);
        }else{
            $("#loginform").submit();
        }
    })
})


/*
    要使用 MVVM 模型将数据和视图分离，要求使用 Vue.js

    Vue.js 的最基本用法就是实例化一个 Vue 对象，其中：
        1）el 属性指定视图（view），即 .html 文件中的元素
        2）data 属性指定模型（model），即数据
        3）app （Vue 对象）本身就是一个 ViewModel
    这三者构成了所谓的 MVVM 模型

    ES 6 中使用 let 关键字声明一个作用域不需要提升的变量
*/
let app = new Vue({
    // 指定视图，login.html 中 class 属性值是 form-signin 的 form 元素
    el: '.form-signin',
    // 指定数据
    data: {
        /*
            登录不成功时要在页面中显示的错误消息
            页面中使用模版语法 {{ errorMessage }} 声明式渲染进 DOM 中
        */
        errorMessage: "",
        /*
            登录是否发生错误，决定上述错误消息是否显示
            页面中使用 v-if 判断错误消息 div 是否显示
        */
        hasError: false,
        /*
            用户名，与页面表单中的 #user 文本框使用 v-model 双向绑定：
            用户输入发生变化时，文本框中的值自动体现在当前属性值中
        */
        phoneNumber: "",
        validateCode: "" ,
        mima:""           // 密码，同 userName 一样和密码框双向绑定
    },
    /*
        定义方法，方法可以：
            1）作为事件代码和页面中元素进行绑定
            2）直接使用 app.方法名() 调用
    */
    methods: {
        // 一个测试方法，没有什么用，可以删掉，可以使用 app.test() 调用执行代码
        /*test: function(){
            alert("这是一个测试方法！");
        },*/
        // 登录，在页面中使用 v-on:click 作为登录按钮的单击事件
        login: function(){

            /*
                和方法访问一样，data 对象中定义的属性可以直接使用 app.属性名 的形式访问（获取或设置值）
                从这点看，借助 Vue 对象，我们得到了一种比较好的代码组织形式

                每次单击登录按钮时，都应该首先把 hasError 设置为 false，
                这是因为很可能用户的上一次登录发生错误，页面上提示了错误消息，
                本次登录前应该先将原来的错误消息清除掉

                如果不使用 Vue，而使用以前 DOM 的方式，我们可能需要获取显示错误消息的元素，
                然后使用 JS 将该元素删除掉或者使之隐藏
                而这意味着在数据和视图并未分离，一旦网页文档结构发生变化，还需要回到 JS 代码中修改代码
                而使用 Vue，仅仅需要将 app.haseError 赋值为 false
                这种对比，也说明了使用 MVVM 模型的优势和必要性
            */
            app.hasError = false;

            /*
                定义变量 randomUrl，通过对 0 ~ 1 之间的一个随机数进行四舍五入得到一个随机的 .json 文件路径

                === 是恒等，严格相等运算符，推荐使用它代替 == 在 if 等语句中做相等判断

                .json 文件的路径此处都使用了绝对路径
                实际上完全可以使用相对路径，如 ../data/login-failure.json
                当由于下面的代码要使用 AJAX 从服务器端获取 .json 的内容以模拟浏览器端和服务器端交互的过程
                此时，需要用 HTTP 协议来请求 .json 文件，所以，此处有三个场景选择：
                    1）本地开发和调试，使用相对路径，需要将网站放到一个本地服务器（Apache、IIS）目录中，使用形如 http://localhost:port/pages/login.html 的 URL 访问登录页面
                    2）本地开发和调试，将 .json 文件上传到 github 或 coding.net 的 Pages 服务中，然后使用下面代码中形式的路径获取 json 数据，.html 文件可以直接双击在浏览器中打开
                    3）开发完成后发布到 Pages 服务中，使用相对路径，当然访问登录页面时使用的是形如 http://ecf.coding.me/pages/login.html 的 URL 访问登录页面

                对于一个登录页面来说，服务器端向浏览器端返回的数据形式相对简单，无非两种情况：
                    1）登录成功：{ "success": true }
                    2）登录失败：{ "success": false, "message": "错误原因：用户名和密码不匹配" }
                而这正是 loign-success.json 和 login-failure.json 的文件内容
                至于如何判断登录是成功还是失败，这是后端应用程序应该处理的，此处只是在前端进行简单的模拟
            */
            let randomUrl =
                Math.round(Math.random()) === 1 ?
                    "https://get-5-group.github.io/GET-APP/data/login-failure.json" :
                    "https://get-5-group.github.io/GET-APP/data/login-success.json";

            /*
                下面的两行代码是通过 AJAX 的方式模拟请求随机的 .json 文件
                AJAX 的代码有很多种不同的写法，如：
                    1）可以直接使用 XMLHttpRequest 对象，将 Web API 的时候提到过，这种写法比较原始，且需要处理太多可能存在的问题，不推荐
                    2）经典的 jQuery 封装的 $.ajax()、$.post()、$.get() 等方法，这种写法需要引入 jQuery 类库，而 AJAX 方法只是 jQuery 类库代码中非常小的一个部分，在不需要其它功能时（如上所述，我们不用 DOM 了，而 jQuery 主要是做 DOM 处理的）还是不要引入 jQuery 了
                    3）使用其他开发人员封装的专门用于 AJAX 请求的 .js 文件，如本例的 qwest 4.5，该类库基于 promise 和 XHR2 的，为后期代码编写带来很多好处
                此处使用了第 3 种写法，当然前提是在页面中引入 ../utils/qwest.min.js

                AJAX 从 JS 代码中向服务器端发送请求（request）、接收响应（response）并进行处理，
                实现了局部刷新的效果

                在本地直接双击在浏览器中打开登录页面运行时，由于存在跨域（cross domain）问题（一个本地文件一个 http），
                需要加上 qwest.setDefaultOptions({ cache: true }); 来防止跨域请求出错
            */
            qwest.setDefaultOptions({ cache: true });

            /*
                使用 GET 方法随机请求一个 .json 文件
            */
            qwest.get(
                // 要请求的服务器端应用程序路径，此处是模拟的 .json 文件路径
                randomUrl,
                /*
                    在请求时需要向服务器端传递的数据（参数）
                    举例：如果
                        1）请求的是 login-success.json
                        2）用户在用户名文本框中输入的是 admin
                        3）用户在密码框中输入的是 12345
                    实际请求的就是 login-success.json?user=admin&pswd=12345

                    很显然下属对象中 user 的值（pswd 的值同理），我们完全可以使用
                        docuemnt.getElementById("user").value 或
                        document.querySelector("#user").value 或
                        $("#user").val()
                    来获取，但这些方法又是 DOM 的方式了，
                    既然使用了 MVVM，实现了双向绑定，当然要使用下面这种方式了
                */
                {user: app.phoneNumber,pswd: app.validateCode }
                // promise 对象特有的 then() 用法，参数是一个匿名函数，主要在其中书写请求成功后的代码
            ).then(
                /*
                    两个参数：
                        xhr：qwest 封装的 XMLHttpRequest 对象
                        msg：本次请求服务器端返回的消息，此处就是 .json 文件中代码对应的 JSON 对象
                */
                function(xhr, msg) {
                    /*
                        无论是 login-failure.json 还是 login-success.json 对应的 JSON 对象
                        都定义了 success 属性用于标记登录是否成功，所以此处可以用于作为判断条件

                        本登录示例模拟的效果是：
                            无论输入任何用户名和密码，要么登录成功转向 slide.html，要么登录失败显示一条错误消息
                    */
                    if (msg.success) {
                        // 登录成功，转向登录成功后的页面
                        document.location = "HomePage.html";
                    }
                    else {
                        /*
                            登录失败，为 hasError 和 errorMessage 赋值
                            Vue 的 ViewModel 会自动在页面上显示包含错误消息的 div 元素
                        */
                        app.hasError = true;
                        app.errorMessage = msg.message;
                    }
                }
            );
        }
    }
});


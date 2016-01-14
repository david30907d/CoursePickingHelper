(function($){
        //先定義JQuery為$，不要讓它衝突        
            $(function(){
                /**一開始的簡易版使用說明**/
                toastr.success("1. 請從選擇系級開始（未選擇系級，無法使用以下功能）<br />2. 點擊課表中的+字號，旁邊欄位會顯示可排的課程，請善加利用<br />3. 任何課程都可以使用課程查詢來找<br />特別小叮嚀(1)：課程查詢以各位輸入的條件篩選，條件越少，找到符合的課程就越多<br />特別小叮嚀(2)：如果有想要查詢其他系的必選修，也可以使用雙主修功能<br />4. 如果排好課，有需要請截圖來保留自己理想的課表（如果課表太大，可利用縮放功能來縮小視窗以利截圖）", "使用說明", {timeOut: 250000});                
                /*initialization!!!*/

                window.credits=0//一開始的學分數是0
                window.courses = {};//宣告一個空的物件
                window.course_of_majors = {};//宣告一個空的物件
                window.course_of_day = {};  //這是宣告日期的陣列
                window.teacher_course = {}; //這是以老師姓名為index的陣列
                window.name_of_course = {}; //這是以課程名稱為index的陣列
                window.name_of_optional_obligatory = [] //這是用來存系上的必修課，檢查有沒有課名是重複的，若有就讓使用者自行決定要上哪堂
                window.user={"name":"","time_table":[]};
                $("#class_credit").text(0);
                window.language="en_US";//固定顯示語言為中文           
                window.url_base="";//used to be the url that link to the syllabus of that course.
                window.haveloadin={D:false,G:false,N:false,O:false,U:false,W:false};//used to checked whether that json of specific degree has been loaded in or not, if it did, the value turn to ture.
                window.lastupdatetime="";//show the update time on server.
                get_json_when_change_degree("json/O.json");//couse O.json is suitable for all kind of degree, so it will be loaded in automatically.
                /*initialization!!!*/

                //當文件準備好的時候，讀入department的json檔, 因為這是顯示系所，沒多大就全部都載進來                              
                $.getJSON("json/department.json",function(depJson){
                    window.department_name={};
                    $.each(depJson,function(ik,iv){
                        if(typeof(window.department_name[iv.degree])=='undefined'){
                            window.department_name[iv.degree]=[];
                        }
                        //console.log(iv.degree)
                        $.each(iv.department,function(jk,jv){
                            var option="";
                            option+=jv.value+'-'+jv.name;
                            window.department_name[iv.degree].push(option);
                        })
                    }) 
                    return_url_and_time_base();
                })      

                $('#v_career').change(function(){
                    var degree=$('#v_career').val();
                    var path = "json/" + degree + ".json";
                    if(haveloadin[degree]==false){
                        get_json_when_change_degree(path);
                        haveloadin[degree]=true;
                    }
                    //cause O means other, general education, department class and others are all included, so this json is loaded in by default.
                })                        
                /*******    ↓製作隱藏側欄的功能↓   *******/
                    /***必修***/
                $("#obligatory-span").click(function(){
                    // 當點到圖案時，若內容是隱藏時則顯示它；反之則隱藏
                    $('#obligatory-post').slideToggle();
                    $('#obligatory-span').find("span").toggle();
                });
                    /***學年課***/
                $("#year-span").click(function(){
                    $('#year-post').slideToggle();
                    $('#year-span').find("span").toggle();
                });
                    /***選修***/
                $("#elective-span").click(function(){
                    $('#elective-post').slideToggle();
                    $('#elective-span').find("span").toggle();
                });
                    /***通識***/
                $("#general-span").click(function(){
                    $('#general-post').slideToggle();
                    $('#general-span').find("span").toggle();
                });
                    /***體育***/
                $("#school-span").click(function(){
                    $('#school-post').slideToggle();
                    $('#school-span').find("span").toggle();

                });
                    /***搜尋***/
                $("#search-span").click(function(){
                    $('#search-post').slideToggle();
                    $('#search-span').find("span").toggle();
                });
                    /***一年級***/
                $("#freshman-head").click(function(){
                    $("#freshman-head").find("span").toggle();
                    $("#freshman").find("button").toggle("slow");
                });

                $("#sophomore-head").click(function(){
                    $("#sophomore-head").find("span").toggle();
                    $("#sophomore").find("button").toggle("slow");
                });
                $("#junior-head").click(function(){
                    $("#junior-head").find("span").toggle();
                    $("#junior").find("button").toggle("slow");
                });
                $("#senior-head").click(function(){
                    $("#senior-head").find("span").toggle();
                    $("#senior").find("button").toggle("slow");
                });
                $("#fifth-grade-head").click(function(){
                    $("#fifth-grade-head").find("span").toggle();
                    $("#fifth-grade").find("button").toggle("slow");
                });
                $("#whole-school-head").click(function(){
                    $("#whole-school-head").find("span").toggle();
                    $("#whole-school").find("button").toggle("slow");
                });


                /*******   ↑製作隱藏側欄的功能↑   *******/
                
                /*******       ↓雙主修選擇↓       *******/
                $("#checkbox").click(function(){
                    if($(this).val() == "noDoubleMajor"){
                        $(this).val("DoubleMajor");
                        $("#v_major_2").toggle("slow");
                        $("#level_2").toggle("slow");
                        $("#textForDM").toggle("slow");
                    }
                    else{
                        $(this).val("noDoubleMajor");
                        $("#v_major_2").toggle("slow");
                        $("#level_2").toggle("slow");
                        $("#textForDM").toggle("slow");
                    }
                });
                /*******       ↑雙主修選擇↑       *******/

                $("#bulletin").delegate("span.fa-trash", "click", function(){   //這是給垃圾桶用的
                    /*
                    if($(this).parents("button").attr("class")=="close obligatory"){
                        $("#obligatory-post").empty();
                    }*/
                    if($(this).parents("button").attr("class")=="close elective"){
                        $("#freshman").empty();
                        $("#sophomore").empty();
                        $("#junior").empty();
                        $("#senior").empty();
                        $("#fifth-grade").empty();
                    }
                    else if($(this).parents("button").attr("class")=="close general"){
                        $('#humanities').empty();
                        $('#social').empty();
                        $('#natural').empty();
                    }
                    else if($(this).parents("button").attr("class")=="close school"){
                        $('#chinese').empty();
                        $('#english').empty();
                        $('#PE-post').empty();
                        $('#military-post').empty();
                        $('#teacher-post').empty();
                        $('#foreign-post').empty();
                        $('#non-graded-optional-post').empty();
                    }
                    else{
                        $(this).parents(".panel-heading").next().empty();
                    }
                });
                $("#bulletin").delegate("button.btn-link", "click", function(){//delegate可以去抓到還不存在的東西，第一個$()是指作用的區域，delegate的()裡面就是option，dblclick是事件
                    var code = $(this).val();//this會代表我抓到的那個東西，也就是option

                    course = courses[code][0];
                    var check=add_course($('#time-table'), course, language);
                    if(check=="available"){
                        change_color($(this),"used");//選過的課程就會改顏色
                    }
                });
                /**********最主要的系級提交funciton，若要修改請謹慎小心!!!***********/
                $("#department_search").click(function(){
                    window.sub_major=get_major_and_level('s')['major'];//為了方便使用者不斷查詢某一系不同年級的課
                    window.sub_level=get_major_and_level('s')['level'];//所以不會自動將這兩個欄位清空到預設值，所以要判斷當這兩個欄位有更動才進行查詢動作
                    /*this part is for specific search*/
                    var major=get_major_and_level('v')['major'];
                    var level=get_major_and_level('v')['level'];
                    reset();
                    $("td").html('<span class="fa fa-plus-circle fa-5x"></span>');
                    add_major(major, level);
                    if ($("#checkbox").val() == "DoubleMajor"){
                        var major2=get_major_and_level('s')['major'];
                        var level2=get_major_and_level('s')['level'];
                        add_major(major2, level2);
                    }
                });                
                
                $("#specific_search").click(function()  //可以用課號搜尋，把input的的課號用.val()取出
                {                    
                    var major=get_major_and_level('s')['major'];
                    var level=get_major_and_level('s')['level'];              
                    var code = $("#class_code").val();
                    //課號搜尋
                    if(major==sub_major&&level==sub_level){
                        code_search(code);// use course code for index to search course.
                        title_search(credits_filter());//這兩行分別是課名搜尋和教師名稱搜尋
                        //把篩選學分的函式當作參數傳入
                        teach_search(credits_filter());
                        $("#credits").val("");
                    }
                    else{
                        sub_major=major;    //紀錄這次提交的系級，好讓下次判斷有沒有變動
                        sub_level=level;
                        reset_for_time_request();
                        department_course_for_specific_search(major,level);
                    }
                });
                $("#clear-button").click(function()
                {
                    reset();
                    $("td").html('<span class="fa fa-plus-circle fa-5x"></span>');  //再把加號的按鈕填上去
                });
                $("#time-table").on( "click", "button[class='close delete']",function(){    //這是用來把一整個課程都刪掉的按鈕
                    var code = $(this).children("input").val(); //找到子代的input，然後把裡面的代碼給取出來
                    var major=get_major_and_level('v')['major'];
                    var level=get_major_and_level('v')['level'];
                    $.each(courses[code],function(ik,iv){
                        if(iv.obligatory_tf==true&&iv.for_dept==major){
                            toastr.warning("此為必修課，若要復原請點擊課表空格", {timeOut: 2500});
                            delete_course($('#time-table'), iv); //就跟add_course一樣，只是把填東西改成刪掉
                            return false;
                        }
                        else{
                            delete_course($('#time-table'), iv)//就跟add_course一樣，只是把填東西改成刪掉
                            return false;
                        }

                    })
                });
                $("#time-table").on("click","span",function(){ //按一下課表欄位就有課程彈出來了
                    if($(this).text()==""){ //我現在才知道null!=""                                               
                        var major=get_major_and_level('v')['major'];
                        var level=get_major_and_level('v')['level'];
                        var s_major=get_major_and_level('s')['major'];
                        var s_level=get_major_and_level('s')['level'];
                        var day=$(this).closest("td").attr("data-day");//因為我把同一時段的課程塞進陣列裡，所以要用index去取
                        var hour=$(this).closest("tr").attr("data-hour");
                        reset_for_time_request();
                         console.log(major+' = '+s_major+' = '+s_level);
                         console.log(day+' '+hour);
                        $.each(course_of_day[day][hour], function(ik, iv){
                            if(iv.for_dept==major||((iv.for_dept==s_major)&&(iv.class==s_level))||iv.for_dept=="全校共同"||iv.for_dept=="共同學科(進修學士班)"){//判斷如果是主系的課就不分年級全部都會顯示出來，如果是輔系的就只顯示該年級的課；如果for_dept==undefined就代表是通識課；如果為全校共同或共同學科(進修學士班)就會是體育、國防、服務學習、全校英外語 or general education, chinese and english.                           
                                if(iv.obligatory_tf==false && iv.for_dept != major && iv.for_dept != s_major){
                                //代表是教務處綜合課程查詢裡面的所有課、國防、師培、全校選修、全校英外語  (obligatory of 師培 can be true or false!!!)
                                    check_which_common_subject(iv);
                                }
                                else if(iv.obligatory_tf==true){
                                    check_which_bulletin_required(iv);
                                //判斷為國英文或是必修課和通識課!!!，包含體育
                                //(obligatory of 師培 can be true or false!!!)
                                }
                                else if(iv.obligatory_tf==false){
                                    check_which_bulletin(iv);
                                    //決定選修課該貼到哪個年級的欄位
                                }                                
                            }

                        })
                    }
                });
                /**********用來把夜校的欄位隱藏起來***********/

                $("#toggleTable").click(function(){                    
                    if($("#toggleTable").val()=="moon")
                    {
                        $("tr:gt(0)").toggle("slow");
                        $("tr:gt(9)").toggle("slow");
                        $(this).val("all");
                        $("#sun-span").toggle("slow");
                    }
                    else if($("#toggleTable").val()=="all"){
                        $("tr:gt(9)").toggle("slow");
                        $(this).val("sun");
                        $("#moon-span").toggle("slow");
                    }
                    else
                    {
                        $("tr:gt(0)").toggle("slow");
                        $(this).val("moon");
                        $(this).find("span").toggle("slow");
                    }
                });

                $("#v_career").change(function(){//會動態變動系所與年級名稱
                //if the career(degree) has been changed, also change the level
                    $("#v_major").empty();
                    $("#s_major").empty();
                    var str="";                                        
                    $( "select option:selected" ).each(function(ik,iv){// filter all selected options, to find the degree options.
                        if($(iv).parent().attr("id")=="v_career"){        
                            str += $( this ).text();
                            //str will be user's degree.
                            //e.g. undergraduate, phd
                        }                        
                    });  
                    $.each(window.department_name[str],function(ik,iv){
                        var newOption=$.parseHTML('<option>'+window.department_name[str][ik]+'</option>');
                        $("#v_major").append(newOption);
                        var newOption=$.parseHTML('<option>'+window.department_name[str][ik]+'</option>');
                        $('#s_major').append(newOption);
                        //append all the department option into major field!!
                    })  
                    if(str=='碩士班'||str=='博士班'||str=='碩專班'||str=='產專班'){
                        $('#v_level').empty();
                        $('#v_level2').empty();
                        $('#s_level').empty();
                        var freshman_value="6",sophomore_value="7";
                        if(str=='博士班'){
                            freshman_value="8";
                            sophomore_value="9";
                        }
                        var newGrade=$.parseHTML('<option value='+freshman_value+'>一年級</option>');
                        var newGrade2=$.parseHTML('<option value='+sophomore_value+'>二年級</option>');
                        $('#v_level').append(newGrade).append(newGrade2);
                        newGrade=$.parseHTML('<option value='+freshman_value+'>一年級</option>');
                        newGrade2=$.parseHTML('<option value='+sophomore_value+'>二年級</option>');
                        $('#v_level2').append(newGrade).append(newGrade2);
                        newGrade=$.parseHTML('<option value='+freshman_value+'>一年級</option>');
                        newGrade2=$.parseHTML('<option value='+sophomore_value+'>二年級</option>');
                        $('#s_level').append(newGrade).append(newGrade2);
                    }
                    else{                        
                        $('#v_level').empty();
                        $('#v_level2').empty();
                        $('#s_level').empty();
                        var target_array=['#v_level', '#v_level2', '#s_level'];
                        var option_array=['<option value="0">無年級</option>','<option value="1">一年級</option>','<option value="2">二年級</option>','<option value="3">三年級</option>','<option value="4">四年級</option>','<option value="5">五年級</option>']
                        var newGrade;
                        $.each(target_array,function(ik,iv){// use for loop use automatically append the option into the right position.
                            $.each(option_array,function(jk,jv){
                                newGrade=$.parseHTML(jv);
                                $(iv).append(newGrade)
                            })
                        })                        
                    }               
                })
            });

            window.week = ["一", "二", "三", "四", "五"];

            /************這是用來把課程放到左邊的欄位**************/
            var bulletin_post = function($target, course, language){
                if( $.type(course.title_parsed)!=="object" )            //判斷課程名稱是不是物件
                    throw 'title_parsed error';
                if( language=="zh_TW" ){
                    course.title_short = course.title_parsed["zh_TW"];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                }
                else{
                    course.title_short = course.title_parsed["en_US"];
                }
                var time=build_bulletin_time(course);//會回傳屬於那個課程的客製化時間title
                    if(course.for_dept == get_major_and_level('s')['major']){
                        if($("#checkbox").val() == "DoubleMajor"){
                            var $option = $($.parseHTML('<div><button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="top" style="color:#B53074;" title="" value=""></button><a class="btn" href="" target="_blank"><span class="fa fa-comment"></span></a></div>'));
                        }
                        else{
                            var $option = $($.parseHTML('<div><button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="top" style="color:#3074B5;" title="" value=""></button><a class="btn" href="" target="_blank"><span class="fa fa-comment"></span></a></div>'));
                        }
                    }
                    else{
                        var $option = $($.parseHTML('<div><button type="button" class="btn btn-link" data-toggle="tooltip" data-placement="top" style="color:#3074B5;" title="" value=""></button><a class="btn" href="" target="_blank"><span class="fa fa-comment"></span></a></div>'));  //把option做成dom，再把dom做成jQuery物件
                    }
                $option.find('button').text(course.title_short);   //將對應的課程內容寫入cell的html語法中
                $option.find('button').attr("title", time);  //在title裡面放課堂時間
                $option.find('button').val(course.code);                
                //把現在找到的這門選修課課程代碼儲存到這個option，並用value表示       
                var url=window.url_base+course.url;     
                $option.find('a').attr('href',url);
                $target.append($option);        //顯示課程，把$option放到elective-post，append是追加在後面                
                $('[data-toggle="tooltip"]').tooltip(); //讓tooltip功能綁上去
            };
            var add_course = function($target, course, language){      //假設target為time-table的參數，course為courses的某一個課程
                if( !$.isArray(course.time_parsed) )
                    throw 'time_parsed error';      //判斷time-parsed是不是陣列
                if( $.type(course.title_parsed)!=="object" )            //判斷課程名稱是不是物件
                    throw 'title_parsed error';
                if(language == "zh_TW"){
                    var tmpCh = course.title_parsed["zh_TW"].split(' ');        //(這是中文課名)切割課程名稱，遇到空格就切開
                    course.title_short = tmpCh[0];      //title_short是會自動宣告的區域變數，存沒有英文的課名
                }
                else{
                    var tmpEn = course.title_parsed["en_US"];
                    course.title_short = tmpEn;
                }
                var check_conflict = false; //他用來判斷是否衝堂，如果有則下面的if就會讓最外圈的each停止
                $.each(course.time_parsed,function(ik, iv){
                    $.each(iv.time,function(jk, jv){
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        if($td.text()!=""){ //用來判斷td裡面是不已經有放過課程了，但若先在裡面放個按鈕那.text()回傳回來的也是空字串
                            check_conflict = true;
                            toastr.error("衝堂喔!請手動刪除衝堂的課程", {timeOut: 2500});
                            return false;   //傳回false就是跳離迴圈
                        }
                    });
                    if(check_conflict==true){
                        return false;
                    }
                });
                if(check_conflict==false){
                    $.each(course.time_parsed, function(ik, iv){
                        $.each(iv.time, function(jk, jv){       //同上，iv.    time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                            var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                            var $cell = $($.parseHTML('<div><div><button type="button" class="close delete" data-dismiss="alert" aria-label="Close" style="color:red;"><span aria-hidden="true"  style="color:red;">&times;</span><input type="hidden" name="code-of-course" value=""></button></div><div class="title"></div><div class="row"><div class="professor col-xs-5"></div><div class="location col-xs-7"></div>'));
                            //把上面的html格式匯入找到的td type中(  parseHtml把後面的包裝成dom，再用一個$包裝成jQuery物件)
                            $cell.find('.title').text(course.title_short).end()
                            $cell.find('input').val(course.code).end()      //將對應的課程內容寫入cell的html語法中，.title就是class="title"
                                 .find('.professor').text(course.professor).end()   //text()   會把東西填入找到的class那裡，end()會回到var $cell那一行
                                 .find('.location').text(fill_loction(course));
                            $td.html($cell.html());     //顯示課程，把cell.html()塞到<td>tag裡面，就算裡面原本有按鈕也會直接被蓋掉，$.html()會取div裡面的東西                    
                        });
                    });
                    add_credits(course);                    
                    window.user.time_table.push(course);//here means once i add this course in my timetable, i will also record this object in a json format, to save this time_table for users. 
                    build_toastr_time(course);
                }
                if(check_conflict==false){
                    return("available");    //沒衝堂，可以變色
                }
                else{
                    return("conflict")  //衝堂，不要變色
                }

            };

            /*******嘗試函式化選修填入課程的功能！！*******/
            var add_major = function(major, level){
                console.log(major+' '+level);
                if(level=="0"){//這是給文學院、管理學院與農業暨自然資源學院這種沒有年級的選項
                        $.each(course_of_majors[major][level],function(ik, iv){//因為這種院的課一定是交給使用者自己選，所以就不自動填入
                            $.each(courses[iv],function(jk, jv){
                                if(jv.for_dept==major){//因為課程代碼會被重複使用，所以用for迴圈判斷他是不是系上開的課
                                    if(jv.obligatory_tf==true){
                                        bulletin_post($("#obligatory-post"), jv, language);
                                    }
                                    if(jv.obligatory_tf==false){
                                        if(jv.class==1){
                                            bulletin_post($("#freshman"), jv, language);
                                        }
                                        if(jv.class==2){
                                            bulletin_post($("#sophomore"), jv, language);
                                        }
                                        if(jv.class==3){
                                            bulletin_post($("#junior"), jv, language);
                                        }
                                        if(jv.class==4){
                                            bulletin_post($("#senior"), jv, language);
                                        }
                                        if(jv.class==5){
                                            bulletin_post($("#fifth-grade"), jv, language);
                                        }
                                        if(jv.class=="0"){
                                            bulletin_post($("#whole-school"), jv, language);
                                        }
                                    }
                                    //check_optional_obligatory(courses[iv]);
                                }
                            })
                        });
                    }                    
                else{                     
                    $.each(course_of_majors[major][level], function(ik, iv){    //先這一年級的必修課全部跑過一次，計算重複課名的數量
                        $.each(courses[iv],function(jk, jv){
                            if(jv.obligatory_tf==true&&jv.for_dept==major&&jv.class==level){//這樣就可以保證我計算到的必修數量一定是該科系該年級該班級了
                                check_optional_obligatory(jv);
                                return false;
                            }
                        })
                    });                       
                    $.each(course_of_majors[major][level], function(ik, iv){//知道那些課程會重複之後，再決定那些課程要填入課表
                        $.each(courses[iv],function(jk, jv){
                            if(jv.for_dept==major){                    
                                var tmpCh = jv.title_parsed["zh_TW"].split(' ');       //(這是中文課名)切割課程名稱，遇到空格就切開
                                title_short = tmpCh[0];     //title_short是會自動宣告的區域變數，存沒有英文的課名
                                if(window.name_of_optional_obligatory[title_short]==1){//只有必修課會被函式計算數量，所以就不用再判斷是否為必修了，一定是                             
                             
                                    if(title_short=="日文(一)"||title_short=="德文(一)"||title_short=="西班牙文(一)"||title_short=="法文(一)"){//判斷是否為德日西法等語言課
                                      
                                        bulletin_post($("#year-post"), jv, language);                            
                                    }
                                    if(jv.time_parsed==0){//表示應該為實習課，所以無時間，神奇的是[]在boolean判斷式中居然會被當作0
                                        bulletin_post($("#obligatory-post"), jv, language);                                            
                                    }
                                    else{
                                        if(jv.class==level){
                                            console.log(jv.for_dept+'tttt');
                                            if(jv.for_dept == get_major_and_level('s')['major']){
                                                if($("#checkbox").val() == "DoubleMajor"){
                                                    bulletin_post($("#obligatory-post"), jv, language);
                                                }  
                                                else{
                                                    add_course($('#time-table'), jv, language);
                                                }
                                            }
                                            else{
                                                add_course($('#time-table'), jv, language);//如果這個課名只有出現過一次，就可以自動填入       
                                            }
                                        }
                                        
                                    }                                        
                                }
                                else{
                                //有分班的必修課
                                //當出現不止一次的時候就丟到bulletin，但是只丟屬於這個班級的                    
                                    if(jv.class==level&&jv.obligatory_tf==true){
                                        show_optional_obligatory(jv);//若重複出現，則讓使用者自己決定
                                    }
                                }
                            }
                        })
                    });
                    $.each(course_of_majors[major], function(ik, iv){//系上所有的選修課都先填入bulletin
                        if(check_if_two_class(level).length==1){//代表只有一個班
                            $.each(iv,function(jk, jv){
                                $.each(courses[jv], function(kk, kv){
                                    if(kv.obligatory_tf==false&&kv.for_dept==major){
                                        //console.log(kv);
                                        check_which_bulletin(kv);//由fuction決定該貼到哪個年級的欄位
                                    }
                                })
                            })
                        }                            
                        else{//代表有兩個班                                
                            var class_EN=level.split("")[1];//班級的A或B，就是最後那個代碼
                            if(ik.split("")[1]==class_EN){
                                $.each(iv,function(jk, jv){
                                    $.each(courses[jv], function(kk, kv){
                                        if(kv.obligatory_tf==false&&kv.for_dept==major&&kv.class.split("")[1]==class_EN&&kv.class.split("")[0]==ik.split("")[0]){
                                            //console.log(kv);
                                            check_which_bulletin(kv);//由fuction決定該貼到哪個年級的欄位
                                            return false;
                                        }
                                    })
                                })
                            }
                        }
                    })
                }
            };

            /**********這是用來刪除衝堂的課程***********/
            var delete_conflict = function($target, course, stop_day, stop_time) {
            //假設target為time-table的參數，course為courses的某一個課程
                $.each(course.time_parsed, function(ik, iv){
                    //each是for迴圈 time-parsed[{...}, {...}]，以微積分為例:一個{"day"+"time"}就是陣列的一格，所以ik為0~1(兩次)
                    var already_delete = false;
                    if(already_delete){
                        return false;
                    }
                    $.each(iv.time, function(jk, jv){       //同上，iv.time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                        if(iv.day==stop_day&&jv==stop_time){
                            already_delete=true;
                            return false;
                        }
                        //console.log("刪掉了"+iv.day+" "+jv+" ");
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()為搜尋td的陣列索引值，找到課程的時間    iv.day為星期，但因為td為陣列所以iv.day要減一    find()是找class!!
                        //console.log($td);
                        $td.empty();    //顯示課程，把cell.html()塞到<td>tag裡面
                    })
                })
            };

            /**********這個函式是用來刪除一整門課程的**********/
            var delete_course = function($target, course) {
            //假設target為time-table的參數，course為courses的某一個課程
                if(course.for_dept == get_major_and_level('s')['major']){
                    if($("#checkbox").val() == "DoubleMajor"){
                        var str = "restore2"
                    }
                    else{
                        var str = "restore"
                    }
                }
                else{
                    var str = "restore"
                }
                $.each(course.time_parsed, function(ik, iv){
                //each是for迴圈 time-parsed[{...}, {...}]，以微積分為例:一個{"day"+"time"}就是陣列的一格，所以ik為0~1(兩次)
                    $.each(iv.time, function(jk, jv){       //同上，iv.time為"time"的陣列{3,4}，jk為0~1、jv為3~4(節數)
                        var $td = $target.find('tr[data-hour=' + jv + '] td:eq(' + (iv.day-1) + ')');
                        //td:eq()為搜尋td的陣列索引值，找到課程的時間    iv.day為星期，但因為td為陣列所以iv.day要減一    find()是找class!!
                        $td.empty();    //顯示課程，把cell.html()塞到<td>tag裡面
                        $td.html('<span class="fa fa-plus-circle fa-5x"></span>');
                    })
                })
                minus_credits(course);
                change_color($("button[value="+course.code+"]"), str);
                $.each(user.time_table,function(ik,iv){
                    //this for loop is to see which element in this array is the one i want to delete.
                    if(iv==course){
                        window.user.time_table.splice(ik,1);
                        //splice can delete the ik'th value and 1 means one only want to delete one value, you can use 3 to delete more value.
                    }
                })
            };

            /****************增加學分****************/
            var add_credits = function(course){
                window.credits+=parseInt(course.credits);//要先把字串型態的學分轉成int才能做加減
                $("#class_credit").text(window.credits);
            };


            var minus_credits = function(course){
                window.credits-=parseInt(course.credits);
                $("#class_credit").text(window.credits);
            };

            /***********清除***********/
            var reset=function(){
                $('#time-table td').empty(); //把目前的time-table清空，好讓下個年級的課程能夠乾淨的顯示
                $('#obligatory-post').empty();//以下是要清掉選修課程、指定時間搜尋等課程
                $('#freshman').empty();
                $('#sophomore').empty();
                $('#senior').empty();
                $('#junior').empty();
                $('#fifth-grade').empty();
                $('#sixth-grade').empty();
                $('#seventh-grade').empty();
                $('#whole-school').empty();
                $('#humanities').empty();
                $('#social').empty();
                $('#natural').empty();
                $('#chinese').empty();
                $('#english').empty();
                $('#PE-post').empty();
                $('#military-post').empty();
                $('#teacher-post').empty();
                $('#foreign-post').empty();
                $('#non-graded-optional-post').empty();
                $('#search-post').empty();
                window.credits=0;
                $("#class_credit").text(window.credits);
                window.name_of_optional_obligatory=[];  //把數過的課程清空                
                window.user={"name":"","time_table":[]};
            }

            /********用+字號功能時，清空側欄********/
            var reset_for_time_request=function(){  //這個function是在你的td的時候，會把該時段的課程顯示，但是要先把顯示欄位清空
                $('#obligatory-post').empty();  //以下是要清掉選修課程、指定時間搜尋等課程
                $('#freshman').empty();
                $('#sophomore').empty();
                $('#senior').empty();
                $('#junior').empty();
                $('#fifth-grade').empty();
                $('#sixth-grade').empty();
                $('#seventh-grade').empty();
                $('#whole-school').empty();
                $('#humanities').empty();
                $('#social').empty();
                $('#natural').empty();
                $('#PE-post').empty();
                $('#foreign-post').empty();
                $('#non-graded-optional-post').empty();
                $('#teacher-post').empty();
                $('#military-post').empty();
                $('#chinese').empty();
                $('#english').empty();
            }

            /**************改變側欄課程顏色**************/
            var change_color=function($target,command){ //一旦添加了課程，則側欄的課名改了顏色
                if(command=="restore"){
                        $target.css("color","#3074B5");
                }
                else if(command=="used"){
                    $target.css("color","red");
                }
                else if(command=="restore2"){
                    $target.css("color","#B53074");
                }
                else{
                    alert("遇到不可預期的錯誤，請聯絡開發小組XD");
                }
            }
            /****把有abcd班別的必修課做判斷，讓使用這自己選擇**********/
            var return_optional_obligatory_course_name=function(course){
                var len=course.title_parsed["zh_TW"].length;
               return course.title_parsed["zh_TW"].substring(0,len-1);

            }
            /*********確認系上必修有無重名*********/
            var check_optional_obligatory=function(course){ 
            //用來確認這個系有幾堂必修課是同名的
                course.title_short = return_optional_obligatory_course_name(course);//will make a new key called title_short, that contains a chinese title which dont contain a character at the end.(like 英文作文(二)a -> 英文作文(二))
                //title_short是會自動宣告的區域變數，存沒有英文的課名

                if(typeof(window.name_of_optional_obligatory[course.title_short]) == 'undefined'){  //如果這一列(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，{}物件裡面可以放任意的東西，在下面會把很多陣列塞進這個物件裡面
                    window.name_of_optional_obligatory[course.title_short] = 1;
                }
                else{
                    window.name_of_optional_obligatory[course.title_short]++;
                }
            }

            /*********處理課名*********/
            var show_optional_obligatory=function(course){
                var trun_title=return_optional_obligatory_course_name(course);
                //cause the character at the end of title is truncate, so named it trun_title
                if(window.name_of_optional_obligatory[trun_title]>1){
                    bulletin_post($("#obligatory-post"), course, language);
                }
            }

            /********確認此系有沒有分AB班(選修用)********/
            var check_if_two_class=function(level){//為了讓我確認他是不是有分AB班，這個是用在選修課的填入判斷上
                level=level.split("");
                return(level);//可以從回傳的長度判斷是否有兩個班
            }

            /********確定有無分AB班********/
            var check_which_class=function(major,level){    //確定他是不是有分A、B班
                if(major=="獸醫學系學士班 A"||major=="獸醫學系學士班 B"||major=="應用數學系學士班 A"||major=="應用數學系學士班 B"||major=="機械工程學系學士班 A"||major=="機械工程學系學士班 B"||major=="土木工程學系學士班 A"||major=="土木工程學系學士班 B"||major=="電機工程學系學士班 A"||major=="電機工程學系學士班 B"){
                    var subclass=major.split(" ");  //A班或B班
                    subclass=subclass[1];
                    var level = level;    //取到年級
                    level=(level+subclass);
                    return level;
                }
                else{
                    return (level);    //取到年級
                }
            }

            /*********判斷課程放入哪個欄位*********/
            var check_which_bulletin=function(course){  //為了判斷A、B班以及不分班的科系開被放到哪個bulletin
                if(course.class=="1"||course.class=="1A"||course.class=="1B"){
                    bulletin_post($("#freshman"),course, language);
                }
                else if(course.class=="2"||course.class=="2A"||course.class=="2B"){
                    bulletin_post($("#sophomore"),course, language);
                }
                else if(course.class=="3"||course.class=="3A"||course.class=="3B"){
                    bulletin_post($("#junior"),course, language);
                }
                else if(course.class=="4"||course.class=="4A"||course.class=="4B"){
                    bulletin_post($("#senior"),course, language);
                }
                else if(course.class=="5"||course.class=="5A"||course.class=="5B"){
                    bulletin_post($("#fifth-grade"),course, language);
                }
                else if(course.class=="6"||course.class=="6A"||course.class=="6B"){
                    //6、7年級是放碩博班的課
                    bulletin_post($("#sixth-grade"),course, language);
                }
                else if(course.class=="7"||course.class=="7A"||course.class=="7B"){
                    bulletin_post($("#seventh-grade"),course, language);
                }
                else if(course.class==""){
                    bulletin_post($("#whole-school"),course, language);
                }                
            }

            /******判斷非必選修之課程的正確欄位******/
            var check_which_bulletin_required=function(course){
                var EN={"語言中心":"","夜共同科":"","夜外文":""};
                var CH={"通識教育中心":"","夜中文":""};
                if(course.discipline!=undefined&&course.discipline!=""){
                    //通識課有細分不同領域
                    check_general(course);
                }
                else if(course.department in EN){
                    bulletin_post($("#english"),course, language);
                }
                else if(course.department in CH){
                    bulletin_post($("#chinese"),course, language);
                }
                else if(course.department == "體育室" ||                 course.department=="夜共同科"){
                    bulletin_post($("#PE-post"),course, language);
                }
                else if(course.department == "師資培育中心"){
                    bulletin_post($("#teacher-post"),course, language);
                }
                else{
                    bulletin_post($("#obligatory-post"),course, language); //因為我把同一時段的課程塞進陣列裡，所以要用index去取
                }
            }

            /*********搜尋用*********/
            var department_course_for_specific_search=function(major,level){
                $.each(course_of_majors[major][level], function(ik, iv){//因為這種輔系的課一定是交給使用者自己選，所以就不自動填入
                            $.each(courses[iv],function(jk,jv){
                                if(jv.for_dept==major){//這個判斷是為了像景觀學程那種專門上別的科系的課的系而設計的
                                    if(jv.obligatory_tf==true&&jv.class==level){
                                        bulletin_post($("#obligatory-post"),jv, language);
                                        return false;
                                    }
                                    if(jv.obligatory_tf==false&&jv.class==level){//因為輔系的查詢只能查一個年級，所以就可以只判斷是否為level
                                        check_which_bulletin(jv);
                                        return false;
                                    }
                                }
                            })
                        });
            }

            /*****確認此通識課之領域*****/
            var check_general=function(course){
                var disciplineH={"文學學群":"","歷史學群":"","哲學學群":"","藝術學群":"","文化學群":""};
                var disciplineS={"公民與社會學群":"","法律與政治學群":"","商業與管理學群":"","心理與教育學群":"","資訊與傳播學群":""};
                var disciplineN={"生命科學學群":"","環境科學學群":"","物質科學學群":"","數學統計學群":"","工程科技學群":""};                
                if(course.discipline in disciplineH){
                    bulletin_post($("#humanities"), course, language)
                }
                else if(course.discipline in disciplineS){
                    bulletin_post($("#social"), course, language)
                }
                else if(course.discipline in disciplineN){
                    bulletin_post($("#natural"), course, language)
                }
                else{
                    alert("有通識課程無法顯示，煩請記下點擊的結束為何並告知開發小組\nFB搜尋：選課小幫手\nhttps://www.facebook.com/CoursePickingHelper")
                }                
            };

            /*********細分綜合課程*********/
            var check_which_common_subject = function(course){
                if(course.department=="師資培育中心"){
                    bulletin_post($("#teacher-post"),course, language);
                }
                else if(course.department=="教官室"){
                    bulletin_post($("#military-post"),course, language);
                }
                else if(course.department=="語言中心"){
                    bulletin_post($("#foreign-post"),course, language);
                }
                else{ 
                    bulletin_post($("#non-graded-optional-post"),course, language);
                }
            }

            /********建立側欄所有課程的資訊(放入title中)********/
            var build_bulletin_time=function(course){
                var EN_CH={"語言中心":"","夜共同科":"","夜外文":"","通識中心":"","夜中文":""};
                var time = [];  //time設定為空陣列
                time.push("上課時間:");
                $.each(course.time_parsed, function(ik, iv){
                    time.push("星期"+week[iv.day-1]+iv.time); //push是把裡面的元素變成陣列的一格
                })
                if(course.intern_time!=""&&course.intern_time!=undefined){//不是每一堂課都會有實習時間
                    time.push("實習時間:"+course.intern_time);
                }
                if(course.discipline!=""&&course.discipline!=undefined){//代表他是通識課
                    time.push("教授:"+course.professor);
                    time.push("學群:"+course.discipline);
                }
                else{
                    time.push("教授:"+course.professor);
                }                
                time = time.join(' ');  //把多個陣列用" "分隔並合併指派給time，此為字串型態，若是將字串split('')，則會回傳一個陣列型態
                return time;
            }

            /*****建立 選擇課程後跳出toastr的資訊*****/
            var build_toastr_time=function(course){
                var EN_CH={"語言中心":"","夜共同科":"","夜外文":"","通識中心":"","夜中文":""};   
                var toast_mg=[];
                toast_mg.push("代碼: "+course.code);
                toast_mg.push("剩餘名額:"+(course.number-course.enrolled_num));
                if(course.discipline!=""&&course.discipline!=undefined){//代表他是通識課
                    toast_mg.push("學群:"+course.discipline);
                    var possibility = cal_possibility(course);// a fuction that return the possibility of enrolling that course successfully.
                    toast_mg.push("中籤率:" + possibility + "%");
                }                
                if(course.note!=""){
                    toast_mg.push("備註:"+course.note);
                }  
                if(course.prerequisite!=""){
                    //prerequisite means you need to enroll that course before enroll this course
                    toast_mg.push("先修科目:"+course.prerequisite);
                }              
                toast_mg = toast_mg.join('<br/>');
                toastr.info(toast_mg);
            }

            /****/
            var credits_filter=function(){
                var credits=$("#credits").val();
                if(credits!=""){return credits;}
                else{return true;}//到時候把整個credits_filter當成參數傳入搜尋的函式
                //參數會return東西到if判斷式，如果沒有輸入學分，就return TRUE就不會有任何影響了
            }

            /*******課程代碼搜尋*******/
            var code_search=function(code){
                if(code!=""){
                    bulletin_post($("#search-post"),courses[code][0], language);
                    $("#class_code").val("");
                }
            }

            /********課程名稱搜尋********/
            var title_search=function(cre_funcion){
                var class_title=$("#class_title").val();//課程名稱搜尋
                condition=cre_funcion;//傳入會篩選學分條件的函式
                var posted_code = [];
                if(class_title!=""){
                    $.each(name_of_course, function(ik, iv){
                        if(ik.search(class_title)!=-1){
                            $.each(iv,function(jk, jv){
                                if(posted_code.indexOf(jv.code)==-1 && (jv.credits==condition||condition==true)){
                                    //indexOf will find whether jv.code is in posted_code this array. 
                                    // if it already exist, then i wont post this course into bulletin.
                                  bulletin_post($("#search-post"),jv, language);
                                  posted_code.push(jv.code);
                                }                            
                            });
                        }
                    })
                    $("#class_title").val("");
                }
            }

            /********授課教授搜尋*********/
            var teach_search=function(cre_funcion){
                var teacher = $("#class_teacher").val();//老師名稱搜尋
                condition=cre_funcion;
                if(teacher!=""){
                    $.each(teacher_course[teacher], function(ik, iv){
                        if(iv.credits==condition||condition==true){
                            bulletin_post($("#search-post"),iv, language);
                        }
                    });
                    $("#class_teacher").val("");
                }
            }

            /*********教室資訊**********/
            var fill_loction=function(course){//回傳教室資訊，型態為string
            //course是課程物件
                var location="";
                if(course.location!=[""]&&course.location!=undefined){
                    //要確保真的有location這個key才可以進if，不然undefined進到each迴圈
                    // 就會跳 [Uncaught TypeError: Cannot read property 'length' of undefined]這個error
                    $.each(course.location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                if(course.intern_location!=[""]&&course.intern_location!=undefined){
                    $.each(course.intern_location,function(ik,iv){
                        location=location+" "+iv;
                    })
                }
                return location;//回傳字串
            }

            /*******獲得使用者選擇的主修資訊與年級*******/
            var get_major_and_level = function(typechar){
                //這會回傳一個major和level的陣列，供全域呼叫使用
                var arr = $('form').serializeArray();//this is a jQuery function
                // will select all form of this html Document, and build and array of object
                var returnarr={};
                var temp;
                if(typechar == 'v'){
                    temp=arr[1]['value'].split('-')[1];
                    returnarr['level']=check_which_class(temp,arr[2]['value']);
                    returnarr['major']=temp.split(' ')[0];
                }
                else if(typechar == 's'){
                    temp=arr[3]['value'].split('-')[1];
                    returnarr['level']=check_which_class(temp,arr[4]['value']);
                    returnarr['major']=temp.split(' ')[0];
                }
                else alert("遇到不可預期的錯誤，請聯絡開發小組");
                return returnarr;
            }    

            /*******變換學制後，匯入該json檔*******/
            var get_json_when_change_degree = function(path)   {
                $.getJSON(path, function(json){  //getJSON會用function(X)傳回X的物件或陣列  
                    $.each(json.course, function(ik, iv){
                        if(typeof(window.course_of_majors[iv.for_dept]) == 'undefined')//如果這一列(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，{}物件裡面可以放任意的東西，在下面會把很多陣列塞進這個物件裡面
                            window.course_of_majors[iv.for_dept] = {};
                        if(typeof(window.course_of_majors[iv.for_dept][iv.class]) == 'undefined'){
                            window.course_of_majors[iv.for_dept][iv.class] = [];//如果這一行(列的名稱為索引值key)是空的也就是undefined，那就對他進行初始化，[]裡面的是放陣列
                        }
                        window.course_of_majors[iv.for_dept][iv.class].push(iv.code);//把東西推進這個陣列裡，概念跟stack一樣
                        if(typeof(window.courses[iv.code])=='undefined'){
                            window.courses[iv.code]=[];
                        }
                        window.courses[iv.code].push(iv);//這邊可以直接把選課號當作索引值key，裡面的值為object
                        $.each(iv.time_parsed, function(jk, jv){//建立日期的陣列
                            $.each(jv.time, function(mk, mv){
                                if(typeof(window.course_of_day[jv.day])=='undefined'){
                                    window.course_of_day[jv.day]={};
                                }
                                if(typeof(window.course_of_day[jv.day][mv])=='undefined'){
                                    window.course_of_day[jv.day][mv]=[];
                                }
                                window.course_of_day[jv.day][mv].push(iv);
                            })
                        })
                        if(typeof(window.teacher_course[iv.professor])=='undefined'){//建立老師名稱的陣列
                            window.teacher_course[iv.professor]=[];
                        }
                        window.teacher_course[iv.professor].push(iv);
                        if(typeof(window.name_of_course[iv.title_parsed.zh_TW])=='undefined'){//中文課名陣列
                            window.name_of_course[iv.title_parsed.zh_TW]=[];
                        }
                        window.name_of_course[iv.title_parsed.zh_TW].push(iv);
                        if(typeof(window.name_of_course[iv.title_parsed.en_US])=='undefined'){//英文課名陣列
                            window.name_of_course[iv.title_parsed.en_US]=[];
                        }
                        window.name_of_course[iv.title_parsed.en_US].push(iv);
                    });
                });
            }

            /*********獲得課程最後的更新時間*********/
            var return_url_and_time_base = function(){
                // this function will return a string, url base, which will link to syllabus of that course. and assign it to a global variable.
                 $.getJSON("json/url_base.json", function(json){
                    window.url_base=json[0];
                    window.lastupdatetime=json[1];
                    $('#updatetime').text(window.lastupdatetime);
                 })

            }

            /****/
            var cal_possibility = function(course){
                var pos = (course.number-course.enrolled_num)/course.number*100;
                pos = new Number(pos);
                pos = pos.toFixed(2);
                if(pos<0){
                    return 0;
                }           
                return pos;     
            }
})(jQuery);

/**
 * Created by Administrator on 2018/3/29.
 */
//上下结构的切换
//2018-1-18
//暴露最少的接口方便调用
//基本的DOM结构  上下两层都是使用定位  最外层父元素overflow:hidden 上下两层的宽度都是通过使用js动态设置,最外层id

var Scroll =function(opt){
    opt =opt ||{};
    var config ={
        eleWrap:opt.eleWrap,             //最外层ID
        autoPlay:opt.autoPlay||false,     //如有需要 可以设置自动转换
        onext :opt.onext ||null,          //右切换按钮
        oprev:opt.oprev || null,          // 做切换按钮
        TopWrap:opt.TopWrap ||null,       //上层的Dom
        BottomWrap:opt.BottomWrap ||null, //下层的DOM
        ActiveIndex :opt.ActiveIndex ||3, //点击到当前位置切换上层Dom列表

    };
    var eleWrap =document.getElementById(config.eleWrap.replace("#",""));
    var TopWrap =  eleWrap.getElementsByClassName(config.TopWrap)[0];
    var BottomWrap =eleWrap.getElementsByClassName(config.BottomWrap)[0];
    var BottomWrapDiv =BottomWrap.children;
    var TopWrapDiv =TopWrap.children;
    var BottomDivWidth =BottomWrapDiv[0].offsetWidth;
    console.log($(TopWrapDiv[0]).outerWidth(true))
    // var TopDivWidth =TopWrapDiv[0].offsetWidth;
    var TopDivWidth =$(TopWrapDiv[0]).outerWidth(true);
    console.log(TopDivWidth);
    BottomWrap.style.width =BottomDivWidth*(BottomWrapDiv.length)+"px";
    TopWrap.style.width =TopDivWidth *(TopWrapDiv.length)+"px";
    var onext =config.onext;
    var oprev =config.oprev;
    if(onext&&oprev){
        onextBtn =eleWrap.getElementsByClassName(onext)[0];
        oprevBtn =eleWrap.getElementsByClassName(oprev)[0];
    };
    var num2 =config.ActiveIndex ;
    var index =0;
    var slideLength =BottomWrapDiv.length;
    // console.log(slideLength);
    function addClass(ele,className){
        if(!ele ||!className){
            return
        };
        var oldClassName =ele.className;
        if(hasClass(ele,className)){
            return
        }else{
            var str ="";
            str += oldClassName;
            str += " ";
            str +=className;
            ele.className =str;
        }
    };
    function hasClass(ele,className){
        if(!ele ||!className){
            return
        };
        var oldClassName =ele.className.split(" ");
        for(var i=0;i<oldClassName.length;i++){
            if(oldClassName[i] ==className){
                return true
            }
        }
        return false
    };
    function removeClass(ele,className){
        if(!ele ||!className){
            return
        };
        var oldClassName =ele.className.split(" ");
        for(var i=0;i<oldClassName.length;i++){
            if(oldClassName[i] ==className){
                delete oldClassName[i]
            }
        }
        ele.className =oldClassName.join(" ");
    };
    function getStyle(ele,attr){
        if(ele.currentStyle){
            return ele.currentStyle[attr]
        }else{
            return getComputedStyle(ele,false)[attr]
        }
    };

    slideFn();
    function slideFn(){
        function animate(obj,json){
            if(obj.timer){
                clearInterval(obj.timer)
            };
            obj.timer =setInterval(function(){
                for(var attr in json){
                    var icur =parseInt(getStyle(obj,attr));
                    var speed =(json[attr]-icur)/5;
                    speed =speed>0?Math.ceil(speed):Math.floor(speed);
                    obj.style[attr] =icur+speed+"px";
                    if(icur ==json[attr]){
                        clearInterval(obj.timer)
                    }
                }
            },30)
        };
        function change(){
            animate(BottomWrap,{left:-index*BottomDivWidth});
            if(index<num2){
                animate(TopWrap,{left:0});
            }else if(index+num2<slideLength&&index>=num2){
                animate(TopWrap,{left:-(index-num2+1)*TopDivWidth})
            }else{
                animate(TopWrap,{left:-(slideLength-5)*TopDivWidth})
            };
            for(var i=0;i<slideLength;i++){
                removeClass(TopWrapDiv[i],'active');
                if(index==i){
                    addClass(TopWrapDiv[i],"active");
                }
            }
        };
        oprevBtn.onclick =function(){
            index++;
            if(index>slideLength-1){
                index =0;
            };
            for(var j=0;j<slideLength;j++){
                removeClass(TopWrapDiv[j],'active');
            }
            addClass(TopWrapDiv[index],'active')

            change();
        };
        onextBtn.onclick =function(){
            index--;
            if(index<=-1){
                index =slideLength-1;
            };

            for(var j=0;j<slideLength;j++){
                removeClass(TopWrapDiv[j],'active');
            }
            addClass(TopWrapDiv[index],'active')
            change();
        }
        for(var i=0;i<slideLength;i++){
            TopWrapDiv[i].index =i;
            TopWrapDiv[i].onclick =function(num){
                return function(){
                    for(var j=0;j<TopWrapDiv.length;j++){
                        removeClass(TopWrapDiv[j],'active');
                    }
                    addClass(TopWrapDiv[num],"active");
                    index =num;
                    change();
                }
            }(i);

        };

    }
}

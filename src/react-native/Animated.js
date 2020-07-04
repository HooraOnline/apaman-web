import View from "./View";
import Keyboard from "./Keyboard";
import Image from "./Image";

const Animated={
    Value:function(value){
        this.interpolate=function(range) {

        }
    },
    timing:function(from,to){

        this.start=function(fn) {
            fn && fn()
        }
        return this;
    },
    parallel:function(arr){
        this.start=function(fn) {
            fn && fn()
        }
        return this;
    },
    View:(props)=><View {...props}></View> ,
    Image:(props)=><Image {...props}></Image>

}

export default Animated;

import React from "react";
import {makeStyles} from "@material-ui/core/styles";
const hex2rgb=function(hex,opacity){
    if(hex.search('#')==-1)
        return hex;
    try{
        hex = hex.replace('#','');
        let r;
        let g;
        let b;
        let result;
        if(hex.length==3){
             r = parseInt(hex.substring(0,1)+hex.substring(0,1), 16);
             g = parseInt(hex.substring(1,2)+hex.substring(1,2), 16);
             b = parseInt(hex.substring(1,3)+hex.substring(1,3), 16);
             result = 'rgba('+r+','+g+','+b+','+opacity+')';
            console.log('saeed',result);
            return result;
        }
         r = parseInt(hex.substring(0,2), 16);
         g = parseInt(hex.substring(2,4), 16);
         b = parseInt(hex.substring(4,6), 16);
         result = 'rgba('+r+','+g+','+b+','+opacity+')';
        return result;
    }catch (e) {
       return  hex
    }

}
export default function View(props) {
    let {style={},children } = props;
    if(Array.isArray(style)){
        style= style.reduce(function(acc, x) {
            for (var key in x) acc[key] = x[key];
            return acc;
        }, {});
    }
    let style2=Object.assign({},style);
    style2.display='flex';
    style2.flexDirection=style2.flexDirection || 'column';
    style2.marginRight=style2.marginRight || style2.marginStart ||style2.marginHorizontal ||style2.margin;
    style2.marginLeft=style2.marginLeft|| style2.marginEnd ||style2.marginHorizontal ||style2.margin;
    style2.marginTop=style2.marginTop  ||style2.marginVertical ||style2.margin;
    style2.marginBottom=style2.marginBottom ||style2.marginVertical ||style2.margin;

    style2.paddingRight=style2.paddingRight || style2.paddingStart ||style2.paddingHorizontal || style2.padding;
    style2.paddingLeft=style2.paddingLeft|| style2.paddingEnd ||style2.paddingHorizontal || style2.padding;
    style2.paddingTop=style2.paddingTop  ||style2.paddingVertical ||style2.padding;
    style2.paddingBottom=style2.paddingBottom ||style2.paddingVertical ||style2.padding;
    style2.border=`${style2.borderWidth}px ${style2.borderStyle||'solid'}  ${style2.borderColor || '#000'}`

    style2.borderTop=`${style2.borderTopWidth}px ${style2.borderStyle||'solid'}  ${style2.borderTopColor || style2.borderColor || '#000'}`
    style2.borderBottom=`${style2.borderBottomWidth}px ${style2.borderStyle||'solid'}  ${style2.borderBottomColor|| style2.borderColor || '#000'}`
    style2.borderRight=`${style2.borderRightWidth ||style2.borderStartWidth}px ${ style2.borderStyle||'solid'}  ${style2.borderRightColor|| style2.borderStartColor|| style2.borderColor || '#000'}`
    style2.borderLeft=`${style2.borderLeftWidth ||style2.borderEndWidth}px ${style2.borderStyle||'solid'}  ${style2.borderLeftColor|| style2.borderEndColor|| style2.borderColor || '#000'}`



    style2.borderTopRightRadius=style2.borderTopRightRadius || style2.borderTopStartRadius || style2.borderRadius;
    style2.borderTopLeftRadius=style2.borderTopLeftRadius || style2.borderTopEndRadius || style2.borderRadius;
    style2.borderBottomRightRadius=style2.borderBottomRightRadius || style2.borderBottomStartRadius || style2.borderRadius;
    style2.borderBottomLeftRadius=style2.borderBottomLeftRadius || style2.borderBottomEndRadius || style2.borderRadius;

    if(style2.left==undefined) style2.left=style2.end;
    if(style2.right==undefined) style2.right=style2.start;

    style2.shadowOffset && (style2['-webkit-box-shadow']= `${style2.shadowOffset.width}px ${style2.shadowOffset.height}px 4px ${hex2rgb(style2.shadowColor,style2.shadowOpacity || 1)}`);
    style2.zIndex=  style2.zIndex || style2.elevation;


    //style2.position= style2.position || 'relative';



    /*const newStyles = {
        main: {
            display:'flex',
            flexDirection:style.flexDirection || 'column',
            marginRight:style.marginRight || style.marginStart ||style.marginHorizontal ||style.margin,
            marginLeft:style.marginLeft|| style.marginEnd ||style.marginHorizontal ||style.margin,
            marginTop:style.marginTop  ||style.marginVertical ||style.margin,
            marginBottom:style.marginBottom ||style.marginVertical ||style.margin,

            paddingRight:style.paddingRight || style.paddingStart ||style.paddingHorizontal || style.padding,
            paddingLeft:style.paddingLeft|| style.paddingEnd ||style.paddingHorizontal || style.padding,
            paddingTop:style.paddingTop  ||style.paddingVertical ||style.padding,
            paddingBottom:style.paddingBottom ||style.paddingVertical ||style.padding,
            border:`${style.borderWidth}px ${style.borderStyle||'solid'}  ${style.borderColor || '#000'}`,

            borderTop:`${style.borderTopWidth}px ${style.borderStyle||'solid'}  ${style.borderTopColor || style.borderColor || '#000'}`,
            borderBottom:`${style.borderBottomWidth}px ${style.borderStyle||'solid'}  ${style.borderBottomColor|| style.borderColor || '#000'}`,
            borderRight:`${style.borderRightWidth ||style.borderStartWidth}px ${ style.borderStyle||'solid'}  ${style.borderRightColor|| style.borderStartColor|| style.borderColor || '#000'}`,
            borderLeft:`${style.borderLeftWidth ||style.borderEndWidth}px ${style.borderStyle||'solid'}  ${style.borderLeftColor|| style.borderEndColor|| style.borderColor || '#000'}`,

            borderTopRightRadius:style.borderTopRightRadius || style.borderTopStartRadius || style.borderRadius,
            borderTopLeftRadius:style.borderTopLeftRadius || style.borderTopEndRadius || style.borderRadius,
            borderBottomRightRadius:style.borderBottomRightRadius || style.borderBottomStartRadius || style.borderRadius,
            borderBottomLeftRadius:style.borderBottomLeftRadius || style.borderBottomEndRadius || style.borderRadius,

            //style.height:style.flex?`${style.flex *100}%`:style.height,
            //style.width:style.flex==1?`100%`:style.width,

        },
    }
    const useStyles = makeStyles(newStyles);
    const classes = useStyles();*/
    return (
        <div {...props}    style={style2}
               //className={classes.main}
        >
            {children}
        </div>
    );
}




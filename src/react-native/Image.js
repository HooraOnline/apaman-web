import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function Image(props) {
    let {style={},source} = props;
    const styles = {
        main: {
           // filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':' -webkit-filter: invert(90%) hue-rotate(175deg);  filter: invert(70%) hue-rotate(175deg);',
            filter:style.tintColor?'invert(408%) sepia(1009%) saturate(175%) hue-rotate(86deg) brightness(118%) contrast(119%)':'',
            'object-fit': 'cover',
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();

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

    /* if(style.tintColor){//for support image icon tint color in react project
         style.color=style.tintColor;
         style.fontSize=style.width || style.height;
         return (
             <View  {...props} style={style} className={props.source} />
         );
     }*/
    return (
        <img  src={source} {...props} style={style} className={classes.main} />
    );
}






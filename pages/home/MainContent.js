import React, {useEffect, useState} from "react";
import images from "../../public/static/assets/images";
import Router from "next/router";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {doDelay, navigation} from "../../src/utils";
import {globalState, persistStore} from "../../src/stores";
import {observer} from "mobx-react";
import {bgWhite} from "../../src/constants/colors";
const useStyles = makeStyles(() =>

        createStyles({
        root: {
            height:'100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: 'paper',
        },
        gridList: {
            width: '100%',
            height: '100%',
        },
        titleBar: {
            height:50,
            background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',

        },
        title: {
            fontSize: 18,
            color: 'white',
        },
    }),
);
const MainContent = observer(props => {
    const classes = useStyles();
    const [tileHeight, setTileHeight] = useState();
    const [tileWidth, setTileWidth] = useState();

    const navigate=function (form,path='') {
        if(globalState.showMenu && global.deviceWidth<1000){
            globalState.showMenu=false;
            return;
        }
        persistStore.curentFormId=form.formId;
        persistStore.curentFormName=form.formName;
        navigation.navigate(path+'/'+form.destination)

    }

    useEffect(() => {
        setTimeout(()=>{
            setTileWidth((global.width-3)/2);
            setTileHeight((global.height-145)/3);
        },200)


    },  []);

    if(!props.forms || !props.forms[0]){
        return null
    }
    return (
        <div style={{display:'flex',flexDirection:'column', alignItems:'center', width:'100%',height:'100%',maxHeight:3*tileHeight, cursor:'pointer' }}>
            {props.forms[0] &&(
                <div onClick={()=>navigate(props.forms[0])} style={{position:'relative', width:'100%',height:'34%',margin:1,maxHeight:tileHeight,maxWidth:2*tileWidth}} >
                    <img src={images[props.forms[0].formName]} style={{objectFit: 'cover',width:'100%',height:'100%',maxWidth:2*tileWidth,maxHeight:tileHeight}} />
                    <div className="backgroundGradient nowrap_mobile" style={{fontSize:14,fontWeight:800,paddingRight:20,paddingBottom:20,position:'absolute',color:bgWhite,  bottom: '+0%'}}>{props.forms[0].persianName}</div>
                </div>
            )}
         <div style={{display:'flex', width:'100%',height:'66%',margin:1, alignItems:'center',justifyContent:'center'}} >
             {props.forms[1] &&(
                 <div onClick={()=>navigate(props.forms[1])} style={{position:'relative',width:'50%',height:'100%',margin:1,maxHeight:2*tileHeight}} >
                     <img src={images[props.forms[1].formName]} className='mainImageClass' style={{objectFit: 'cover',width:'100%',height:'100%',maxWidth:tileWidth,maxHeight:2*tileHeight}}/>
                     <div className="backgroundGradient nowrap_mobile" style={{fontSize:14,fontWeight:800,paddingRight:20,paddingBottom:20,position:'absolute',color:bgWhite,bottom: '0%'}}>{props.forms[1].persianName}</div>
                 </div>
             )}

             <div style={{width:'50%',height:'100%',margin:1,}} >
                 {props.forms[2] &&(
                     <div onClick={()=>navigate(props.forms[2])} style={{position:'relative',width:'100%',height:'50%',margin:1,maxWidth:tileWidth,maxHeight:tileHeight}} >
                         <img src={images[props.forms[2].formName]} className='mainImageClass' style={{objectFit: 'cover',width:'100%',height:'100%',maxWidth:tileWidth-2,maxHeight:tileHeight,}} />
                         <div className="backgroundGradient nowrap_mobile" style={{fontSize:14,fontWeight:800,paddingRight:20,paddingBottom:20,position:'absolute',color:bgWhite,bottom: '0%'}}>{props.forms[2].persianName}</div>
                     </div>
                 )}

                 {props.forms[3] &&(
                     <div onClick={()=>navigate(props.forms[3])} style={{position:'relative',width:'100%',height:'50%',margin:1,maxWidth:tileWidth,maxHeight:tileHeight}} >
                         <img src={images[props.forms[3].formName]} className='mainImageClass'  style={{objectFit: 'cover',width:'100%',height:'100%',maxWidth:tileWidth-2,maxHeight:tileHeight}}/>
                         <div className="backgroundGradient nowrap_mobile" style={{fontSize:14,fontWeight:800,paddingRight:20,paddingBottom:20,position:'absolute',color:bgWhite,bottom: '0%'}}>{props.forms[3].persianName}</div>
                     </div>
                 )}
             </div>
         </div>
            <style jsx global>{`
            .wrapper {
                         display: grid;
                         grid-gap: 0.3%;
                         grid-template-columns: 50% 50% ;
                         grid-template-rows:33% auto;
                         background-color: #fff;
                         color: #444;

                        }
                        .mainImageClass{
                        width:100%;
                        max-height:100%;
                        height:100%;
                        border-radius:5px;

                        }
                        .box-image{
                        width:100%;
                        position:relative;
                        max-height:100%;
                        cursor:pointer;
                        }

                        .box {
                        background-color: #444;
                        color: #fff;

                        font-size: 150%;

                        }

                        .backgroundGradient{
                        width: 100%;
                        position: absolute;
                        background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(0, 0, 0, 0));
                        color: white;
                        font-size: 16px;
                        padding: 20px;
                        border-bottom-left-radius:5px;
                        border-bottom-right-radius:5px;
                        }
                        @supports (-webkit-touch-callout: none) {
                        .backgroundGradient{
                                            width: 100%;
                                            position: absolute;
                                            background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(0, 0, 0, 0));
                                            color: white;
                                            font-size: 44px;
                                            max-height:30%;
                                            padding: 5.5%;
                                            }
                                                }
                      @media screen and (max-width: 768px){
                        .nowrap_mobile{
                        white-space:no-wrap;
                        font-size:100%;
                        }
                        }
            `}</style>
        </div>
       /* <div style={{maxHeight:global.height-130}} className={classes.root}>
            <div   style={{padding: 2,display:'wrep',}}>
                <div  className="first_child box-image" onClick={()=>navigate(props.forms[0])}>
                    <img src={images[props.forms[0].formName]} className='mainImageClass'/>
                    <div className="backgroundGradient nowrap_mobile"
                         style={{bottom: '+0%'}}>{props.forms[0].persianName}</div>
                </div>
                <div className="second_child box-image"  onClick={()=>navigate(props.forms[1])}>
                    <img src={images[props.forms[1].formName]} className='mainImageClass'/>
                    <div className="backgroundGradient nowrap_mobile"
                         style={{bottom: '0%'}}>{props.forms[1].persianName}</div>
                </div>
                <div className="third_child box-image"  onClick={()=>navigate(props.forms[2],'/car')}>
                    <img src={images[props.forms[2].formName]} className='mainImageClass'/>
                    <div className="backgroundGradient nowrap_mobile"
                         style={{bottom: '0%'}}>{props.forms[2].persianName}</div>
                </div>
                {props.forms[3] &&(
                    <div className="fourth_child box-image"  onClick={()=>navigate(props.forms[3])}>
                        <img src={images[props.forms[3].formName]} className='mainImageClass'/>
                        <div className="backgroundGradient nowrap_mobile"
                             style={{bottom: '0%'}}>{props.forms[3].persianName}</div>
                    </div>
                )}
            </div>
            <style jsx global>{`
            .wrapper {
                         display: grid;
                         grid-gap: 0.3%;
                         grid-template-columns: 50% 50% ;
                         grid-template-rows:33% auto;
                         background-color: #fff;
                         color: #444;

                        }
                        .mainImageClass{
                        width:100%;
                        max-height:100%;
                        height:100%;
                        border-radius:5px;

                        }
                        .box-image{
                        width:100%;
                        position:relative;
                        max-height:100%;
                        cursor:pointer;
                        }

                        .box {
                        background-color: #444;
                        color: #fff;

                        font-size: 150%;

                        }

                        .first_child {
                          grid-column: 1/3 ;
                          grid-row: 1;

                        }
                        .second_child {
                        grid-column: 1 ;
                        grid-row: 2/4 ;
                        }
                        .third_child{
                        grid-column:2;
                        grid-row:2;
                        }
                        .fourth_child{
                        grid-column:2;
                        grid-row:3;
                        }
                        .backgroundGradient{
                        width: 100%;
                        position: absolute;
                        background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(255, 30, 30, 0));
                        color: white;
                        font-size: 120%;
                        max-height:30%;
                        padding: 5.5%;
                        border-bottom-left-radius:5px;
                        border-bottom-right-radius:5px;
                        }
                        @supports (-webkit-touch-callout: none) {
                        .backgroundGradient{
                                            width: 100%;
                                            position: absolute;
                                            background-image: linear-gradient(to top, rgba(0, 0, 0, 2.58), rgba(0, 0, 0, 0));
                                            color: white;
                                            font-size: 120%;
                                            max-height:30%;
                                            padding: 5.5%;
                                            }
                                                }
                      @media screen and (max-width: 768px){
                        .nowrap_mobile{
                        white-space:no-wrap;
                        font-size:100%;
                        }
                        }
            `}</style>
        </div>*/


    );
})

export default MainContent;

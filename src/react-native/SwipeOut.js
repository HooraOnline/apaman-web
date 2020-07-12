import React, {useEffect,useState,useRef} from "react";
import View from './View'
import {gray, primaryDark, textDisabled} from "../constants/colors";
import {Text, TouchableOpacity} from "./index";
import { render } from "react-dom";
import useScrollOnDrag from "react-scroll-ondrag";
import styled from "styled-components";
import {isMobile} from "../utils";
export default function SwipeOut({runScroll,children,style={},right,close,onOpen,onClose}) {
    const [deviceWidth, setDeviceWidth] = useState(width);
    const [width, setWidth] = useState(width);
    const [height, setHeight] = useState(width);
    const containerRef = useRef(null);
    let cHeight,cWidth;
    if(containerRef.current){
        cHeight=containerRef.current.clientHeight;
    }

    const { events } = useScrollOnDrag(containerRef, {
        runScroll: runScroll && runScroll(containerRef)
    });
    let Container = styled.div`
      display: inline-block;
      overflow-x: hidden;
      overflow-y: hidden;
      border: 0px solid #000;
      padding: 0 0px;
      white-space: nowrap;
      height:100%;
    `;
    let ChildrenHost = styled.div`
      display: inline-block;
      margin: 0px 0px;
      width: 100%;
       height: 100%;
    `;
    let ActionHost = styled.div`
      display: inline-block;
      height: 100%;
      margin: 0px 0px;
      background: yellow;
     
    `;
    let btnContainerWidth=right.length*60

    useEffect(() => {
        setDeviceWidth(global.width);
        if(containerRef.current){
            cWidth=containerRef.current.clientWidth;
            cHeight=containerRef.current.clientHeight;
            setWidth(cWidth);
            setHeight(cHeight);
        }
    },  []);

    if(isMobile()){
        return(
            <View   style={style}>
                <div ref={containerRef} style={{width:width, overflowX: 'scroll', }}  onScroll={(e)=>{onOpen()}}>
                    <View style={{width:close?width+2:width+btnContainerWidth+2}}>
                        <View style={{flex:3,flexDirection:'row',}}>
                            <View style={{flex:close?1:2}} >
                                {children}
                            </View>

                            {!close &&
                            <View style={{width:btnContainerWidth,flexDirection:'row',}} >
                                {right.map((action)=><TouchableOpacity style={{width:60,}} onPress={action.onPress}>{action.component}</TouchableOpacity> )}
                            </View>
                            }
                        </View>
                    </View>
                </div>
            </View>
        );
    }

//for web dragable
    return (
        <View style={style}>
            <Container {...events} ref={containerRef}  onScroll={(e)=>onOpen()}  >
                <ChildrenHost>
                    <View style={{flex:close?1:1}} >
                        {children}
                    </View>
                </ChildrenHost>
                <ActionHost>
                    <View style={{width:btnContainerWidth, flexDirection:'row',position:'relative' }}>
                        {
                            right.map((action)=><TouchableOpacity style={{width:160,height:height+16,position:'absolute',top:-32}} onPress={action.onPress}>{action.component}</TouchableOpacity> )
                        }
                    </View>
                </ActionHost>
            </Container>
        </View>
    );


}


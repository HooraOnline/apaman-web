import React from 'react';
import {Platform, StyleSheet, Text, View} from '../react-native';

import {border, borderLight} from '../constants/colors';

export default function CardUnitInfo({
                                         unitNumber,
                                         floorNumber,
                                         area,
                                         children,
                                         isMain,
                                         openable,
                                         isOpen,
                                         bgColor = 'white',
                                         style,
                                     })
{

    return (
        <View
            style={[
                styles.container,
                {
                    borderBottomEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    borderTopEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    marginEnd: openable ? 0 :0,// 16,
                    backgroundColor: bgColor,
                    elevation: isMain ? 0 : 2,
                    //shadowColor: isMain ? '#fff' : '#000',
                    //shadowOffset: {width: 0, height: 10},
                    //shadowOpacity: isMain ? 0 : 0.2,
                },style
            ]}>
            {unitNumber && (
                <View style={[styles.startSide]}>
                    <View
                        style={[styles.unitNumber, {marginHorizontal: isMain ? 16 : 0}]}>
                        <Text style={[styles.textUnitNumber, styles.textUnit]}>
                            {unitNumber}
                        </Text>
                    </View>
                    <View
                        style={{flex: 1, flexDirection: 'row', marginTop: isMain ? 8 : 0}}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: borderLight,
                                borderEndWidth: 0.5,
                            }}>
                            <Text style={[styles.textUnit]}> {floorNumber} </Text>
                        </View>
                        {area &&(
                            <View
                                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={[styles.textUnit]}>{area}</Text>
                            </View>
                        )}

                    </View>
                </View>
            )}
            <View style={[styles.endSide, {paddingEnd: isMain ? 0 : 16}]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 0,
        flexDirection: 'row',
        borderBottomStartRadius: 10,
        borderTopStartRadius: 10,
       // marginTop: 10,
        marginStart: 0,


    },
    startSide: {
        borderColor: borderLight,
        borderEndWidth: 1.5,
        flex: 1,
        maxWidth:100,
        minWidth:50,
        flexDirection: 'column',
    },
    endSide: {
        flex: 3,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    unitNumber: {
        flex: 1,
        borderColor: borderLight,
        borderBottomWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUnitNumber: {
        fontFamily:'IRANYekanFaNum-Bold',
        fontSize: 16,
    },
    textUnit: {
        color: border,
        paddingVertical: 6,
    },
});




/*
import React from 'react';
import {border, borderLight,borderSeparate} from '../constants/colors';

export default function CardUnitInfo({
                                         unitNumber,
                                         floorNumber,
                                         area,
                                         children,
                                         isMain,
                                         openable,
                                         isOpen,
                                         bgColor = 'white',
                                         style,
                                     }) {
    return (
        <div
            style={
                {
                    display:'flex',
                    flex: 1,
                    marginVertical: 5,
                    flexDirection: 'row',
                    borderBottomStartRadius: 10,
                    borderTopStartRadius: 10,
                    addingTop: 0,
                    marginStart: 16,
                    borderBottomEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    borderTopEndRadius: openable ? isOpen ? 10 : 0 : 10,
                    marginEnd: openable ? 0 : 16,
                    backgroundColor: bgColor,
                    elevation: isMain ? 0 : 2,
                    shadowColor: isMain ? '#fff' : '#000',
                    shadowOffset: {width: 0, height: .5},
                    shadowOpacity: isMain ? 0 : 0.2,


                }
            }>
            {unitNumber && (
                <div style={styles.startSide}>
                    <div
                        style={{marginHorizontal: isMain ? 16 : 0,borderBottom:'1px solid',borderColor:borderSeparate,textAlign:'center',width:'95%'}}>
                        <span style={{}}>
                            {unitNumber}
                        </span>
                    </div>
                    <div
                        style={{display:'flex', flex: 1, flexDirection: 'row', marginTop: isMain ? 8 : 0,textAlign:'center'}}>
                        <div
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderColor: borderLight,
                                borderEndWidth: '5px solid',
                            }}>
                            <span style={styles.textUnit}> {floorNumber} </span>
                        </div>
                        {area &&(
                            <div
                                style={{flex: 1, alignItems: 'center', justifyContent: 'center',borderRight:'1px solid ',borderColor:borderSeparate,textAlign:'center'}}>
                                <span style={styles.textUnit}>{area}</span>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <div style={ { flex: 3,
                justifyContent: 'center',
                paddingHorizontal: 16,
                paddingEnd: isMain ? 0 : 16,
             }}>{children}</div>
        </div>
    );
}

const styles ={
    container: {

    },
    startSide: {
        borderLeft: '0.5px solid',
        borderColor:borderSeparate,
        flex: 0.3,
        height:60,
        flexDirection: 'column',
        marginTop:'5px'
    },
    endSide: {

    },
    unitNumber: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textUnitNumber: {
        fontFamily:'IRANYekanBold' ,
        fontSize: 16,
    },
    textUnit: {
        color: border,
        paddingVertical: 6,
    },
};
*/

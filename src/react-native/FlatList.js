import View from "./View";
import ScrollView from "./ScrollView";
import Text from "./Text";
export default function FlatList({data,renderItem,keyExtractor,ListEmptyComponent,ItemSeparatorComponent,LoadingComponent,loading,onScroll,style,key,mHeight,ListHeaderComponent}) {
    if(loading){
        return (
            LoadingComponent || <View style={{flex:1,alignItems:'center',marginTop:30}}>
                <Text>در حال بارگذاری ...</Text>
            </View>
        );
    }
    if(data.length==0){
        return (
            ListEmptyComponent || <View style={{flex:1,alignItems:'center',marginTop:30}}>
                <Text>هیچ آیتمی وجود ندارد</Text>
            </View>
        );
    }
    return (
        <View style={style}>
            <ScrollView style={{}} >
                {ListHeaderComponent}
                {
                    data.map((item,index)=>{
                        return(
                            <div>
                                <div>
                                    {
                                        renderItem({item,index})
                                    }
                                </div>
                                <View>
                                    {
                                        ItemSeparatorComponent && ItemSeparatorComponent()
                                    }
                                </View>

                            </div>
                        )

                    })
                }

            </ScrollView>
        </View>
    );
}


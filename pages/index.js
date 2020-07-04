import React, { Component } from "react";
import Router from "next/router";
import {fetchStore} from "../src/utils";
import persistStore from "../src/stores/PersistStore";
import {View} from "../src/react-native";
import LoginPage from "./login";
import Main from "./Main";
import userStore from "../src/stores/User";

export default class Index extends Component {
    constructor() {
        super();
        this.state={
            isFetchedStore:false,
        }
    }

    init=async()=> {
        await fetchStore();

        if (persistStore.token) {

            Router.replace('/Main');

        }else{
            Router.push("/login");
        }
    }

    async componentDidMount() {
        if(userStore.RoleID){
            this.setState({isFetchedStore:true})
        }else{
            await fetchStore();
            this.setState({isFetchedStore:true})
        }

    }


    render () {
        if(!this.state.isFetchedStore){
            return null;
        }


        if (persistStore.token) {

            return (
                <Main/>
            );
        }

        return <LoginPage/>;
    }
}

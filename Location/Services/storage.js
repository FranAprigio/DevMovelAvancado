import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from './firebase';

export default class Storage {

    listContents(onContentUpdate) {
         firebase.firestore().collection('usuários').onSnapshot((querySnapshot)=>{
            let contents = [];
            querySnapshot.forEach((doc)=>{
              const { email, senha , usuario} = doc.data();
              let id = doc.id;
              let date =  new Date().toLocaleDateString();
              contents.push({id, email, senha , usuario});
            });
            onContentUpdate(contents);
         });
    } 

    edit(index, content) {
         firebase.firestore().collection('usuários').doc(index).set(content);         
    }

     add(content) {
         firebase.firestore().collection('usuários').add(content);         
    }

     deleteContent(index) {
         firebase.firestore().collection('usuários').doc(index).delete().then(() => {
            console.log('Apagado com sucesso');
        })
        .catch((error) => {
            console.log(error);
        });
    }

}
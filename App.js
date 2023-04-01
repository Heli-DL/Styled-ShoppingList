import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Header, Icon, Input, Button, ListItem } from '@rneui/themed';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
    tx.executeSql('create table if not exists items (id integer primary key not null, product text, amount text);');
    }, null, updateList);
    }, []);
    
  const saveItem = () => {
    db.transaction(tx => {
    tx.executeSql('insert into items (product, amount) values (?, ?);',
    [product, amount]);
    }, null, updateList)
    }

  const updateList = () => {
    db.transaction(tx => {
    tx.executeSql('select * from items;', [], (_, { rows }) => {
      setItems(rows._array);
    }
    );
    }, null, null);
    }
  
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from items where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
      />
      <View style={styles.inputs}>
        <Input placeholder='Type product' label='PRODUCT'
          onChangeText={(product) => setProduct(product)}
          value={product}/>  
        <Input placeholder='Type amount' label='AMOUNT'
          onChangeText={(amount) => setAmount(amount)}
          value={amount}/>  
      </View>    
      <Button title="SAVE" raised icon={{name: 'save', color:'#fff'}}
          onPress={saveItem} 
          color='secondary'
          buttonStyle={{
            borderRadius: 3,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}/> 
      <View style={styles.list}>
      <FlatList 
        ListHeaderComponent={() => <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginTop: 5}}>Items</Text>}
        data={items} 
        keyExtractor={item => item.id.toString()}
        renderItem={ ({ item }) =>
          <ListItem bottomDivider >
            <ListItem.Content>
              <ListItem.Title>{item.product}</ListItem.Title>
              <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon type="material" name="delete" color="#ad1457" onPress={() => deleteItem(item.id)}/>
          </ListItem>
        }
      />  
      </View>    
    </View>
);
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'flex-start',
   marginTop: 20
  },
  inputs: {
    width: '90%',
    marginTop: 20
  },
  list: {
    marginTop: 5,
    width: '90%'
  }
});

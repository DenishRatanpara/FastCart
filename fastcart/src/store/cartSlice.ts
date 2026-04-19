import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery{
    _id:mongoose.Types.ObjectId
    name:string
    category:string
    price:string
    unit:string
    quantity:number
    image:string
    createdAt?:Date
    updatedAt?:Date
   



}

interface IGrocerySlice {
    cartData:IGrocery[],
      subTotal:number,
         
          deliveryFee:number,
          finalTotal:number

}

const initialState:IGrocerySlice={
        cartData:[],
        subTotal:0,
         
          deliveryFee:40,
          finalTotal:40
      

}
const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:((state,action:PayloadAction<IGrocery>)=>{
            state.cartData.push(action.payload)
            cartSlice.caseReducers.calculateTotal(state)

        }),
        incremetnQuantity:((state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item=state.cartData.find(i=>i._id==action.payload)
            if(item){
                item.quantity=item.quantity+1 
            }
           cartSlice.caseReducers.calculateTotal(state)
        

        }),

        decrementQuantity:((state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item=state.cartData.find(i=>i._id==action.payload)
            if(!item)
                return 
          
            if(  item.quantity>1)
                {
                item.quantity=item.quantity-1;
            }
            else{
                state.cartData = state.cartData.filter(i => i._id !== action.payload)
            }
             cartSlice.caseReducers.calculateTotal(state)

        }),
        removeCartItem:((state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
          
                      state.cartData=state.cartData.filter(i=>i._id !== action.payload)
            
       cartSlice.caseReducers.calculateTotal(state)
        }),
        calculateTotal:(state)=>{
            state.subTotal=state.cartData.reduce((sum,item)=>sum + Number(item.price)*item.quantity,0)
            state.deliveryFee=state.subTotal>100?0:40
            state.finalTotal=state.subTotal+state.deliveryFee
        },
        clearCart: (state) => {
            state.cartData = [];
            cartSlice.caseReducers.calculateTotal(state);
        }
    }
})

export const {addToCart,incremetnQuantity,decrementQuantity,removeCartItem,clearCart} = cartSlice.actions
export default cartSlice.reducer
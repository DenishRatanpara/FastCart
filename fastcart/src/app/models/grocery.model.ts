import mongoose from "mongoose"

export interface IGrocery{
    _id?:mongoose.Types.ObjectId
    name:string
    category:string
    price:string
    unit:string
    image:string
    createdAt?:Date
    updatedAt?:Date


}


const grocerySchema= new mongoose.Schema<IGrocery>({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["Fruits & Vegetables",
  "Dairy & Eggs",
  "Bakery",
  "Foodgrains, Oil & Masala",
  "Snacks & Branded Foods",
  "Beverages",
  "Chocolates & Confectionery",
  "Meat, Fish & Eggs",
  "Frozen Foods",
  "Personal Care",
  "Home Care",
  "Baby Care",
  "Household Essentials",
  "Pet Care",
  "Stationery"],
  required:true
    },
    price:{
        type:String,
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    image:{
        type:String,
         required:true

    }

},{
    timestamps:true
})

const Grocery=mongoose.models.Grocery || mongoose.model("Grocery",grocerySchema)


export default Grocery
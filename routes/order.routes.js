const express = require("express");
const router = express.Router();
const { ORDER } = require("../models/order.model");
const { ORDERITEM } = require("../models/order-item.model");
const { PRODUCT } = require("../models/product.model");
// get all orders
router.get("/", async (req, res) => {
  const orders = await ORDER.find()
    .populate("user", "name")
    .populate({ path: "orderItems", populate: "product" })
    .sort({ createdAt: -1 });
  if (!orders)
    return res.status(404).json({ msg: "Error cannot get the orders" });
  res.status(200).json(orders);
});

// get order by id
router.get("/:id", async (req, res) => {
  const order = await ORDER.findById(req.params.id)
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order)
    return res.status(404).json({ msg: "Error cannot get the orders" });
  res.status(200).json(order);
});

// get order by status
router.get("/get/status", async (req, res) => {
  const status = req.query.status;
  const order = await ORDER.find({ status: status })
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order)
    return res.status(404).json({ msg: "Error cannot get the orders" });
  res.status(200).json(order);
});

// create an order
router.post("/create", async (req, res) => {
  const { user, orderItems, shippingAddress, phone } = req.body;
  let totalPrice = 0;
  const items = Promise.all(
    orderItems.map(async (items) => {
      const orderItems = new ORDERITEM({
        product: items.product,
        quantity: items.quantity,
      });
      const orderItem = await orderItems.save();
      const product = await PRODUCT.findById(items.product, "price");
      const quantity = orderItem.quantity;
      totalPrice += product.price * quantity;

      return orderItem._id;
    })
  );
  const orderItemsIds = await items;
  console.log(totalPrice);
  let order = new ORDER({
    user,
    orderItems: orderItemsIds,
    total: totalPrice,
    shippingAddress: {
      governorate: shippingAddress.governorate,
      city: shippingAddress.city,
      street: shippingAddress.street,
    },
    phone,
  });
  order = await order.save();
  if (!order) return res.status(500).json({ ms: "Failed To Create The Order" });

  res.status(200).json(order);
});

// update an order status
router.put("/updateStatus/:id", async (req, res) => {
  const { id } = req.params;
  const order = await ORDER.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  if (!order)
    return res.status(401).json({ msg: "Failed To Update Order Status" });
  res.status(200).json(order);
});

// orders count
router.get(`/get/count`, async (req, res) => {
  const ordersCount = await ORDER.countDocuments();

  if (!ordersCount) {
    res.send(500).json({ success: false });
  }

  res.send({ ordersCount });
});

// delete an order
router.delete("/remove/:id", async (req, res) => {
  const { id } = req.params;
  // let deleteMassage = 'deleted Successfully'
  // const order = await ORDER.findById(req.params.id).select('orderItems');
  // const orderItems = order.orderItems
  // orderItems.map(async (id)=>{
  //     const deletedOrderitmes =await ORDERITEM.findByIdAndDelete(id)
  //     if(!deletedOrderitmes) {deleteMassage = 'failed to delete order items'}
  // })

  const deletedOrder = await ORDER.findByIdAndDelete(id).then(async (order) => {
    if (order) {
      await order.orderItems.map(async (orderitem) => {
        await ORDERITEM.findByIdAndDelete(orderitem);
      });
      return res.status(200).json({ msg: "order deleted successfully" });
    } else {
      return res.status(401).json({ msg: "cannot delete the order" });
    }
  });
});

// get total sales
router.get('/get/totalsales', async (req, res)=> {
  const totalSales= await ORDER.aggregate([
      { $group: { _id: null , totalSales : { $sum : '$total'}}}
  ])

  if(!totalSales) {
      return res.status(400).send('Theres no sales yet')
  }

  res.send({totalSales: totalSales[0].totalSales})
})

module.exports = router;

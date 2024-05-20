// src/Components/GenerateReceipt.js
import React from 'react';
import { View, Button } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

const GenerateReceipt = ({ order }) => {
  const handleCanvas = (canvas) => {
    canvas.width = 350;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';

    let y = 30;
    ctx.fillText(`Order ID: ${order._id}`, 10, y);
    y += 20;
    ctx.fillText(`Table: ${order.table}`, 10, y);
    y += 20;
    ctx.fillText(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 10, y);
    y += 20;

    order.products.forEach((product, index) => {
      ctx.fillText(`${index + 1}. ${product.name} - $${product.price.toFixed(2)}`, 10, y);
      y += 20;
      product.selectedOptions.forEach(option => {
        ctx.fillText(`+ ${option.name} - $${option.price.toFixed(2)}`, 20, y);
        y += 20;
      });
    });

    ctx.fillText(`Total: $${order.totalPrice.toFixed(2)}`, 10, y);
  };

  return (
    <View>
      <Canvas ref={handleCanvas} />
      <Button title="Download Receipt" onPress={() => {}} />
    </View>
  );
};

export default GenerateReceipt;

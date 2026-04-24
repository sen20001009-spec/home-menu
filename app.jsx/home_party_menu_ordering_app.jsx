import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

/**
两个链接使用方法

客人点菜链接：
https://你的网址

你自己后台：
https://你的网址#admin

区别：
普通链接 = 客人点菜
#admin = 查看全部订单

修改菜单：改 menuData
*/

const menuData = [
  {
    id: 1,
    name: "红烧肉",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1604908176997-431c3c1d76fd?q=80&w=800"
  },
  {
    id: 2,
    name: "宫保鸡丁",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800"
  },
  {
    id: 3,
    name: "番茄炒蛋",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1625944525903-b0f5dc4f9b9c?q=80&w=800"
  },
  {
    id: 4,
    name: "可乐鸡翅",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800"
  }
];

export default function MenuApp() {
  const isAdmin = window.location.hash === "#admin";

  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("orders");
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem("orders", JSON.stringify(newOrders));
  };

  const add = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: {
        ...item,
        qty: (prev[item.id]?.qty || 0) + 1
      }
    }));
  };

  const remove = (item) => {
    setCart((prev) => {
      const qty = (prev[item.id]?.qty || 0) - 1;
      if (qty <= 0) {
        const n = { ...prev };
        delete n[item.id];
        return n;
      }
      return {
        ...prev,
        [item.id]: { ...item, qty }
      };
    });
  };

  const submitOrder = () => {
    const newOrders = [...orders, cart];
    saveOrders(newOrders);
    setCart({});
    alert("点菜成功");
  };

  const merged = {};
  orders.forEach((order) => {
    Object.values(order).forEach((item) => {
      if (!merged[item.id]) merged[item.id] = { ...item, qty: 0 };
      merged[item.id].qty += item.qty;
    });
  });

  const total = Object.values(merged).reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  if (isAdmin) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">后台总订单</h1>

        {Object.values(merged).map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b py-2"
          >
            <div>
              {item.name} × {item.qty}
            </div>
            <div>¥{item.price * item.qty}</div>
          </div>
        ))}

        <div className="mt-4 font-bold text-lg">
          总价：¥{total}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="p-3 space-y-3">
        {menuData.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <img
              src={item.image}
              className="w-full h-40 object-cover"
            />

            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-500">¥{item.price}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => remove(item)}
                >
                  <Minus size={16} />
                </Button>

                <Button
                  size="icon"
                  onClick={() => add(item)}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t">
        <Button className="w-full" onClick={submitOrder}>
          提交点菜
        </Button>
      </div>
    </div>
  );
}

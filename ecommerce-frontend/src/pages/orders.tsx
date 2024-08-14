import { ReactElement, useState } from "react";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Link } from "react-router-dom";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const [rows] = useState<DataType[]>([
    {
      _id: "84594375",
      amount: 454983,
      quantity: 1235,
      discount: 490,
      status: <span className="red">prcoessing</span>,
      action: <Link to={`/products/${84594375}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
    {
      _id: "yt48q47",
      amount: 654357,
      quantity: 75982,
      discount: 4750,
      status: <span className="red">Done</span>,
      action: <Link to={`/products/${"yt48q47"}`}>view</Link>,
    },
  ]);
  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    true
  )();
  return (
    <div className="container">
      <h1>My Orders</h1>
      {Table}
    </div>
  );
};

export default Orders;

import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import { Skeleton } from "../../components/loader";
import { useStatsQuery } from "../../redux/api/dashboardApi";
import { RootState } from "../../redux/store";
import { getLastMonths } from "../../utils/features";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const { last6Months: months } = getLastMonths();

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError } = useStatsQuery(user?._id!);

  const stats = data?.stats!;

  if (isError) return <Navigate to={"/"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={user?.photo || userImg} alt="User" />
            </div>

            <section className="widget-container">
              <WidgetItem
                percent={stats.changePercentage.revenue}
                amount={true}
                value={stats.count.revenue}
                heading="Revenue"
                color="rgb(0, 115, 255)"
              />
              <WidgetItem
                percent={stats.changePercentage.user}
                value={stats.count.user}
                color="rgb(0 198 202)"
                heading="Users"
              />
              <WidgetItem
                percent={stats.changePercentage.order}
                value={stats.count.order}
                color="rgb(255 196 0)"
                heading="Transactions"
              />

              <WidgetItem
                percent={stats.changePercentage.product}
                value={stats.count.product}
                color="rgb(76 0 255)"
                heading="Products"
              />
            </section>

            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                <BarChart
                  labels={months}
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 115, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)"
                />
              </div>

              <div className="dashboard-categories">
                <h2>Inventory</h2>

                <div>
                  {stats.categoryCount.map((i, idx) => (
                    <CategoryItem
                      key={idx}
                      value={i.count}
                      heading={i.category}
                      color={`hsl(${idx * 60}, 70%, 50%)`}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[stats.userRatio.female, stats.userRatio.male]}
                  backgroundColor={[
                    "hsl(340, 82%, 56%)",
                    "rgba(53, 162, 235, 0.8)",
                  ]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              <Table data={stats.latestTransactions} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{`${percent > 10000 ? 9999 : percent}%`}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {`${percent < -10000 ? -9999 : percent}%`}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}>
      <span
        style={{
          color,
        }}>
        {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div
    className="category-item"
    style={{
      marginBottom: "1rem",
      fontFamily: "sans-serif",
    }}>
    {/* Heading */}
    <h5 style={{ marginBottom: "0.3rem" }}>{heading}</h5>

    {/* Progress bar container */}
    <div
      style={{
        height: "12px",
        backgroundColor: "#e5e5e5",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
      }}>
      {/* Progress bar fill */}
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
          height: "100%",
          borderRadius: "8px",
          transition: "width 0.5s ease-in-out",
        }}></div>
    </div>

    {/* Percentage text */}
    <span style={{ fontSize: "0.9rem", fontWeight: 500, color: color }}>
      {value}%
    </span>
  </div>
);

export default Dashboard;

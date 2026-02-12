import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/loader";
import { usePieQuery } from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError } = usePieQuery(user?._id!);

  const order = data?.charts.orderFullfillment;
  const categories = data?.charts.productCategories || [];
  const stock = data?.charts.stockAvailability;
  const revenue = data?.charts.revenueDistribution;
  const ageGroup = data?.charts.usersAgeGroup;
  const adminCustomer = data?.charts.adminCustomer;

  if (isError) return <Navigate to={"/admin/dashboard"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>

        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            {/* Order Fulfillment */}
            <section>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    order?.processing || 0,
                    order?.shipped || 0,
                    order?.delivered || 0,
                  ]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            {/* Product Categories */}
            <section>
              <div>
                <DoughnutChart
                  labels={categories.map((i: any) => i.category)}
                  data={categories.map((i: any) => i.count)}
                  backgroundColor={categories.map(
                    (_: any, idx: number) => `hsl(${(idx + 1) * 60}, 70%, 50%)`
                  )}
                  legends={false}
                  offset={categories.map(() => 0)}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            {/* Stock Availability */}
            <section>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[
                    stock?.inStock || 0,
                    stock?.outOfStock || 0,
                  ]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2>Stock Availability</h2>
            </section>

            {/* Revenue Distribution */}
            <section>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    revenue?.marketingCost || 0,
                    revenue?.discount || 0,
                    revenue?.burnt || 0,
                    revenue?.productionCost || 0,
                    revenue?.netMargin || 0,
                  ]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            {/* Users Age Group */}
            <section>
              <div>
                <PieChart
                  labels={[
                    "Teenager (Below 20)",
                    "Adult (20-40)",
                    "Older (Above 40)",
                  ]}
                  data={[
                    ageGroup?.teen || 0,
                    ageGroup?.adult || 0,
                    ageGroup?.old || 0,
                  ]}
                  backgroundColor={[
                    `hsl(10, 80%, 80%)`,
                    `hsl(10, 80%, 50%)`,
                    `hsl(10, 40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            {/* Admin vs Customers */}
            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[
                    adminCustomer?.admin || 0,
                    adminCustomer?.customer || 0,
                  ]}
                  backgroundColor={[
                    `hsl(335, 100%, 38%)`,
                    "hsl(44, 98%, 50%)",
                  ]}
                  offset={[0, 50]}
                />
              </div>
              <h2>Admin vs Customers</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;

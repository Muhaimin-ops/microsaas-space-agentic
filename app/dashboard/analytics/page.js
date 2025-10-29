"use client";

import { useState, useEffect } from "react";
import LoadingSkeleton from "../../components/LoadingSkeleton";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7days");
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulated data - replace with actual API calls
      setAnalyticsData({
        ideasOverTime: [
          { date: "Jan 09", ideas: 12 },
          { date: "Jan 10", ideas: 18 },
          { date: "Jan 11", ideas: 15 },
          { date: "Jan 12", ideas: 22 },
          { date: "Jan 13", ideas: 28 },
          { date: "Jan 14", ideas: 25 },
          { date: "Jan 15", ideas: 31 },
        ],
        conversionFunnel: [
          { stage: "Ideas Submitted", count: 156, percentage: 100 },
          { stage: "Ideas Validated", count: 98, percentage: 62.8 },
          { stage: "Blueprints Created", count: 45, percentage: 28.8 },
          { stage: "Projects Deployed", count: 12, percentage: 7.7 },
        ],
        successRate: {
          successful: 72,
          failed: 28,
        },
        topCategories: [
          { category: "SaaS Tools", count: 45 },
          { category: "E-commerce", count: 32 },
          { category: "Analytics", count: 28 },
          { category: "Marketing", count: 24 },
          { category: "Automation", count: 19 },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.ideas || d.count || 0));
    
    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>{title}</h3>
        <div style={styles.barChart}>
          {data.map((item, index) => (
            <div key={index} style={styles.barGroup}>
              <div style={styles.barWrapper}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${((item.ideas || item.count) / maxValue) * 150}px`,
                  }}
                >
                  <span style={styles.barValue}>{item.ideas || item.count}</span>
                </div>
              </div>
              <div style={styles.barLabel}>{item.date || item.category}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FunnelChart = ({ data }) => {
    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Conversion Funnel</h3>
        <div style={styles.funnelChart}>
          {data.map((stage, index) => (
            <div key={index} style={styles.funnelStage}>
              <div
                style={{
                  ...styles.funnelBar,
                  width: `${stage.percentage}%`,
                  backgroundColor: `hsl(${250 - index * 30}, 70%, 60%)`,
                }}
              >
                <span style={styles.funnelLabel}>{stage.stage}</span>
                <span style={styles.funnelValue}>{stage.count} ({stage.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PieChart = ({ successful, failed }) => {
    const total = successful + failed;
    const successDegrees = (successful / total) * 360;
    
    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Success Rate</h3>
        <div style={styles.pieChartWrapper}>
          <div
            style={{
              ...styles.pieChart,
              background: `conic-gradient(#10b981 0deg ${successDegrees}deg, #ef4444 ${successDegrees}deg 360deg)`,
            }}
          >
            <div style={styles.pieCenter}>
              <div style={styles.pieCenterValue}>{successful}%</div>
              <div style={styles.pieCenterLabel}>Success</div>
            </div>
          </div>
          <div style={styles.pieLegend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: "#10b981" }} />
              <span>Successful ({successful}%)</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: "#ef4444" }} />
              <span>Failed ({failed}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Analytics Dashboard</h1>
        <div style={styles.headerActions}>
          <select
            style={styles.dateRangeSelect}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button style={styles.exportButton} onClick={exportData}>
            📊 Export Data
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={styles.chartSkeleton}>
              <LoadingSkeleton height={300} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Total Ideas</div>
              <div style={styles.metricValue}>156</div>
              <div style={styles.metricChange}>+23% from last period</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Validation Rate</div>
              <div style={styles.metricValue}>62.8%</div>
              <div style={styles.metricChange}>+5% from last period</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Deployment Success</div>
              <div style={styles.metricValue}>72%</div>
              <div style={styles.metricChange}>+8% from last period</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricLabel}>Avg. Time to Deploy</div>
              <div style={styles.metricValue}>14 days</div>
              <div style={styles.metricChange}>-2 days from last period</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div style={styles.chartsGrid}>
            <SimpleBarChart
              data={analyticsData.ideasOverTime}
              title="Ideas Over Time"
            />
            
            <FunnelChart data={analyticsData.conversionFunnel} />
            
            <PieChart
              successful={analyticsData.successRate.successful}
              failed={analyticsData.successRate.failed}
            />
            
            <SimpleBarChart
              data={analyticsData.topCategories}
              title="Top Categories"
            />
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  dateRangeSelect: {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "0.875rem",
    backgroundColor: "white",
    cursor: "pointer",
  },
  exportButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "1.5rem",
  },
  chartSkeleton: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  metricCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  metricLabel: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  metricValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1a1f2e",
    marginBottom: "0.5rem",
  },
  metricChange: {
    fontSize: "0.75rem",
    color: "#10b981",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "1.5rem",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  chartTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "#1a1f2e",
    marginBottom: "1.5rem",
    margin: "0 0 1.5rem 0",
  },
  barChart: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "200px",
    padding: "0 0.5rem",
  },
  barGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  barWrapper: {
    display: "flex",
    alignItems: "flex-end",
    height: "150px",
    width: "100%",
  },
  bar: {
    width: "80%",
    backgroundColor: "#667eea",
    borderRadius: "4px 4px 0 0",
    margin: "0 auto",
    position: "relative",
    transition: "all 0.3s",
    minHeight: "20px",
  },
  barValue: {
    position: "absolute",
    top: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#4b5563",
  },
  barLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
    textAlign: "center",
  },
  funnelChart: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  funnelStage: {
    position: "relative",
  },
  funnelBar: {
    height: "40px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    color: "white",
    transition: "all 0.3s",
  },
  funnelLabel: {
    fontSize: "0.875rem",
    fontWeight: "500",
  },
  funnelValue: {
    fontSize: "0.75rem",
  },
  pieChartWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  pieChart: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pieCenter: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  pieCenterValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1a1f2e",
  },
  pieCenterLabel: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },
  pieLegend: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#4b5563",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
};
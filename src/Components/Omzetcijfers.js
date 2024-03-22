import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const Omzetcijfers = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [timeframe, setTimeframe] = useState('daily');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchRevenueData();
  }, [timeframe, startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get(`http://208.109.231.135/orders/revenue/${timeframe}`, {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };
  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 3,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '3',
      stroke: '#e27b00',
      fill: '#e27b00',
    },
  };

   const screenWidth = Dimensions.get('window').width;

   const data = {
    labels: revenueData.map((revenue) => {
      const date = new Date(revenue._id); // Assuming revenue._id is a date string
      let label;
      switch (timeframe) {
        case 'daily':
          label = `${date.getMonth() + 1}/${date.getDate()}`; // Formats to "month/day"
          break;
        case 'monthly':
          label = `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`; // Formats to "month/year"
          break;
        case 'yearly':
          label = date.getFullYear().toString(); // Formats to "year"
          break;
        default:
          label = `${date.getMonth() + 1}/${date.getDate()}`; // Default to "month/day"
      }
      return label;
    }),
    datasets: [
      {
        data: revenueData.map((revenue) => {
          const revenueValue = Number(revenue.totalRevenue);
          return isNaN(revenueValue) ? 0 : revenueValue;
        }),
        color: (opacity = 1) => `rgba(242, 123, 0, ${opacity})`,
      },
    ],
  };

return (
    <View style={styles.container}>

      {/* Date Pickers for Start and End Date */}
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>Start Date</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>End Date</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      {/* Line Chart to Display Revenue Data */}
      {revenueData.length > 0 ? (
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data available to display chart</Text>
      )}

      {/* Display Revenue Data */}
      <View style={styles.revenueDataContainer}>
        <Text style={styles.revenueDataTitle}>Revenue Data:</Text>
        {revenueData.map((revenue, index) => (
          <View key={index} style={styles.revenueDataRow}>
            <Text style={styles.revenueDate}>{revenue._id}</Text>
            <Text style={styles.revenueAmount}>${revenue.totalRevenue.toFixed(2)}</Text>
          </View>
        ))}
      </View>
            {/* Timeframe Selection Buttons */}
            <View style={styles.timeframeSelection}>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === 'daily' && styles.activeTimeframe]}
          onPress={() => setTimeframe('daily')}
        >
          <Text style={styles.timeframeButtonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === 'monthly' && styles.activeTimeframe]}
          onPress={() => setTimeframe('monthly')}
        >
          <Text style={styles.timeframeButtonText}>Monthly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeframeButton, timeframe === 'yearly' && styles.activeTimeframe]}
          onPress={() => setTimeframe('yearly')}
        >
          <Text style={styles.timeframeButtonText}>Yearly</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  timeframeSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeframeButton: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e27b00',
    borderRadius: 5,
  },
  activeTimeframe: {
    backgroundColor: '#e27b00',
  },
  timeframeButtonText: {
    color: '#000',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#e27b00',
    padding: 10,
    borderRadius: 5,
  },
  dateButtonText: {
    color: '#fff',
  },
  chart: {
    borderRadius: 25,
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    alignSelf: 'center',
  },
  revenueDataContainer: {
    padding: 10,
  },
  revenueDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  revenueDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  revenueDate: {
    fontSize: 14,
    color: '#333',
  },
  revenueAmount: {
    fontSize: 14,
    color: '#333',
  },
});

export default Omzetcijfers;
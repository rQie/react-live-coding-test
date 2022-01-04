import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const Chart = (props) => {
  return (
    <ResponsiveContainer height='60%' aspect={2 / 1}>
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey={(x) => x.stat.name} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='base_stat' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart

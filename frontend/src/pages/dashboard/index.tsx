import React from 'react';
import { Card, Row, Col, Statistic, DatePicker } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const Dashboard: React.FC = () => {
  // 模拟数据
  const salesData = [
    { month: '1月', sales: 1150 },
    { month: '2月', sales: 850 },
    { month: '3月', sales: 850 },
    { month: '4月', sales: 680 },
    { month: '5月', sales: 580 },
    { month: '6月', sales: 200 },
    { month: '7月', sales: 580 },
    { month: '8月', sales: 350 },
    { month: '9月', sales: 1050 },
    { month: '10月', sales: 1100 },
    { month: '11月', sales: 350 },
    { month: '12月', sales: 580 },
  ];

  const storeRankings = [
    { name: '工专路 0 号店', sales: 323234 },
    { name: '工专路 1 号店', sales: 323234 },
    { name: '工专路 2 号店', sales: 323234 },
    { name: '工专路 3 号店', sales: 323234 },
    { name: '工专路 4 号店', sales: 323234 },
    { name: '工专路 5 号店', sales: 323234 },
    { name: '工专路 6 号店', sales: 323234 },
  ];

  return (
    <div>
      <Row gutter={24}>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="总销售额"
              value={126560}
              precision={0}
              prefix="¥"
              suffix={
                <div>
                  <div>
                    周同比 12%
                    <ArrowUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} />
                  </div>
                  <div>
                    日同比 11%
                    <ArrowDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} />
                  </div>
                </div>
              }
            />
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16 }}>
              日销售额 ¥12,423
            </div>
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="访问量"
              value={8846}
              suffix={
                <div style={{ width: '100%', height: 50 }}>
                  {/* 这里可以添加迷你图表 */}
                </div>
              }
            />
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16 }}>
              日访问量 1,234
            </div>
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="支付笔数"
              value={6560}
              suffix={
                <div style={{ width: '100%', height: 50 }}>
                  {/* 这里可以添加迷你图表 */}
                </div>
              }
            />
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16 }}>
              转化率 60%
            </div>
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              title="运营活动效果"
              value={78}
              suffix="%"
            />
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 16, paddingTop: 16 }}>
              <div>
                周同比 12%
                <ArrowUpOutlined style={{ color: '#f5222d', marginLeft: 4 }} />
              </div>
              <div>
                日同比 11%
                <ArrowDownOutlined style={{ color: '#52c41a', marginLeft: 4 }} />
              </div>
            </div>
          </StyledCard>
        </Col>
      </Row>

      <StyledCard
        title="销售趋势"
        extra={
          <div>
            <RangePicker />
          </div>
        }
      >
        <Column
          data={salesData}
          xField="month"
          yField="sales"
          color="#1890ff"
          columnStyle={{ radius: [4, 4, 0, 0] }}
        />
      </StyledCard>

      <StyledCard title="门店销售额排名">
        {storeRankings.map((store, index) => (
          <Row key={store.name} style={{ marginBottom: 16 }}>
            <Col span={2}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: index < 3 ? '#314659' : '#f0f2f5',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index < 3 ? 'white' : '#000',
                }}
              >
                {index + 1}
              </div>
            </Col>
            <Col span={16}>{store.name}</Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              {store.sales.toLocaleString()}
            </Col>
          </Row>
        ))}
      </StyledCard>
    </div>
  );
};

export default Dashboard; 
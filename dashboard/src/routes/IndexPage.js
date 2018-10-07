import React from "react";
import { connect } from "dva";
import styles from "./IndexPage.css";
import { Card, Layout, Row, Col, Switch } from "antd";

const { Header, Content } = Layout;

function IndexPage({ chain, dispatch }) {
  const { provider = {}, user = {}, uptime, health = {} } = chain;
  const updateStatus = () => {
    dispatch({
      type: "chain/update",
      payload: {
        running: health.running === 1 ? 0 : 1
      }
    });
  };

  return (
    <Layout>
      <Header className={styles.header}>
        Chain Host Dashboard
        <span className={styles.status}>
          Network Status:{" "}
          <Switch
            checkedChildren="up"
            unCheckedChildren="down"
            checked={health.running === 1}
            onChange={updateStatus}
          />{" "}
          Chain Status:{" "}
          <Switch
            checkedChildren="up"
            unCheckedChildren="down"
            checked={uptime === 1}
            disable
          />
        </span>
      </Header>
      <Content>
        <Row gutter={8}>
          <Col span={12}>
            <Card title="User">
              <Row gutter={8}>
                <Col span={12}>
                  <Card type="inner" title="Available Balance">
                    {user.free}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card type="inner" title="Locked Balance">
                    {user.locked}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Provider">
              <Row gutter={8}>
                <Col span={12}>
                  <Card type="inner" title="Available Balance">
                    {provider.free}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card type="inner" title="Locked Balance">
                    {provider.locked}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

IndexPage.propTypes = {};

function mapStateToProps({ chain }) {
  return { chain };
}

export default connect(mapStateToProps)(IndexPage);

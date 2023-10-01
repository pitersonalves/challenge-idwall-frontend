import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Button,
  Form,
  Input,
  Spin,
  Radio,
  Select,
  Typography,
  message
} from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const RegisterPerson = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [description, setDescription] = useState('');
  const [base, setBase] = useState('');
  const [classification, setClassification] = useState('');
  const [nationalityList, setNationalityList] = useState([]);
  const [classificationNameList, setClassificationNameList] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const fetchData = async () => {

    await axios.get("http://localhost:8080/person-wanted/populate-data", {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    })
      .then(async (response: any) => {
        console.log('Fetch Data - Register Page: ', response)
        const keyValueArrayNationality = response.data.nationality
          .filter((nationality: any | null) => nationality !== null)
          .map((nationality: any) => ({ value: nationality, label: nationality }));

        setNationalityList(keyValueArrayNationality);

        const keyValueArrayClassification = response.data.classificationName
          .filter((classification: any | null) => classification !== null)
          .map((classification: any) => ({ value: classification, label: classification }));


        setClassificationNameList(keyValueArrayClassification);

        setIsloading(false);

      })
      .catch((error) => {
        console.error('Erro ao buscar os dados:', error);
      });
  }

  const registerPerson = async () => {

    const payload = {
      'name': name,
      'description': description,
      'nationality': nationality,
      'gender': gender,
      'base': base,
      'classification_name': classification,
      'image': 'https://w7.pngwing.com/pngs/702/979/png-transparent-wanted-poster-template-american-frontier-poster-miscellaneous-text-poster.png'
    };

    await axios.post("http://localhost:8080/person-wanted", payload, {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    })
      .then(async (response: any) => {
        console.log('Save person with success: ', response)
        message.success("New person registred with success");
      })
      .catch((error) => {
        console.error('Erro ao salvar os dados:', error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Spin tip="Loading Data..." size="large" style={{ display: 'flex', justifyContent: 'center' }} />
        <Title level={3}>Loading Data...</Title>

      </div> : <>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 700 }}
        >
          <Form.Item>
            <Title>Register New Wanted</Title>
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group onChange={(event) => setGender(event.target.value)}>
              <Radio value="Female">Female</Radio>
              <Radio value="Male">Male</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Name">
            <Input onChange={(event) => setName(event.target.value)} />
          </Form.Item>
          <Form.Item label="Nationality">
            <Select
              style={{ width: 150 }}
              options={nationalityList}
              onChange={(value) => setNationality(value)} />
          </Form.Item>
          <Form.Item
            label="Classification"
            name={'classification'}
          >
            <Select
              style={{ width: 150 }}
              options={classificationNameList}
              onChange={(value) => setClassification(value)} />

          </Form.Item>
          <Form.Item
            label="Description"
            name={'description'}
          >
            <TextArea rows={4} onChange={(event) => setDescription(event.target.value)} />
          </Form.Item>
          <Form.Item
            label="Wanted By"
            name={'wanted'}
          >
            <Select
              defaultValue="FBI"
              style={{ width: 150 }}
              options={[
                { value: 'FBI', label: 'FBI' },
                { value: 'Interpool', label: 'Interpool' },
                { value: 'Own base', label: 'Own base' },
              ]}
              onChange={(value) => setBase(value)} />

          </Form.Item>
          <Form.Item>
            <Button onClick={registerPerson}>Register</Button>
          </Form.Item>
        </Form>
      </>}
    </>
  )
}

export default RegisterPerson;

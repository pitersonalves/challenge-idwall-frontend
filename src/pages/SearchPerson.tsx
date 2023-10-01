import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Select,
    Radio,
    Spin,
    Card,
    Typography,
    Pagination,
    Modal
} from 'antd';

const { Item } = Form;
const { Meta } = Card;
const { Title } = Typography;

const SearchPerson = () => {
    const [isLoading, setIsloading] = useState(true);
    const [nationalityList, setNationalityList] = useState([]);
    const [classificationNameList, setClassificationNameList] = useState([]);
    const [name, setName] = useState('');
    const [nationality, setNationality] = useState('');
    const [classification, setClassification] = useState('');
    const [gender, setGender] = useState('');
    const [base, setBase] = useState('');
    const [wantedList, setWantedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [columnsPerRow, setColumnsPerRow] = useState(4);
    const [rows, setRows] = useState<any>({});
    const [showList, setShowList] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [nameSelected, setNameSelected] = useState('');
    const [nationalitySelected, setNationalitySelected] = useState('');
    const [classificationSelected, setClassificationSelected] = useState('');
    const [genderSelected, setGenderSelected] = useState('');
    const [descriptionSelected, setDescriptionSelected] = useState('');

    const [form] = Form.useForm();

    const divideDataIntoRows = (data: any, columnsPerRow: any) => {
        const rows = [];
        for (let i = 0; i < data.length; i += columnsPerRow) {
            const row = data.slice(i, i + columnsPerRow);
            rows.push(row);
        }
        return rows;
    };

    const handleCardClick = (person: any) => {
        setNameSelected(person.name);
        setNationalitySelected(person.nationality);
        setClassificationSelected(person.classification_name);
        setGenderSelected(person.gender);
        setDescriptionSelected(person.description);
        setSelectedPerson(true);
        setModalVisible(true);
    };

    const getAllWanted = async () => {
        console.log('Name:', name);
        console.log('Nationality:', nationality);
        console.log('Classification:', classification);
        console.log('Gender:', gender);
        console.log('Base:', base);

        await axios.get("http://localhost:8080/person-wanted", {
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            params: {
                "name": name,
                "nationality": nationality,
                "classification": classification,
                "gender": gender,
                "base": base,

            }
        })
            .then(async (response: any) => {
                console.log('RESPONSE GET ALL PEOPLE WANTED: ', response);
                setWantedList(response.data);
            })
            .catch((error) => {
                console.error('Erro ao buscar os dados:', error);
            });
    };

    const onFinish = async (values: any) => {
        setCurrentPage(1);
        await getAllWanted();
    }

    const fetchData = async () => {

        await axios.get("http://localhost:8080/person-wanted/populate-data", {
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
        })
            .then(async (response: any) => {
                console.log('Fecth Data Response - Search Page: ', response)
                const keyValueArrayNationality = response.data.nationality
                    .filter((nationality: any | null) => nationality !== null)
                    .map((nationality: any) => ({ value: nationality, label: nationality }));

                setNationalityList(keyValueArrayNationality);

                const keyValueArrayClassification = response.data.classificationName
                    .filter((classification: any | null) => classification !== null)
                    .map((classification: any) => ({ value: classification, label: classification }));


                setClassificationNameList(keyValueArrayClassification);

                await getAllWanted();

            })
            .catch((error) => {
                console.error('Erro ao buscar os dados:', error);
            });
    }

    useEffect(() => {

        const filteredData = wantedList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        console.log('filteredData', filteredData.length)
        const result = divideDataIntoRows(filteredData, columnsPerRow);
        setRows({ result: result });
        setShowList(true);
        setIsloading(false);

    }, [wantedList, currentPage]);

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
                <><div className="input-container" style={{
                    width: "100%", backgroundColor: "#f0f0f0",
                    border: "1px solid #ccc", borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    padding: "10px"
                }}>
                    <Form form={form} onFinish={onFinish}>
                        <Row>
                            <Col>
                                <Form
                                    name="form1"
                                    layout="inline">
                                    <Item
                                        label="Name"
                                        name={'name'}
                                    >
                                        <Input onChange={(event) => setName(event.target.value)} />
                                    </Item>
                                    <Item
                                        label="Nationality"
                                        name={'nationality'}
                                    >
                                        <Select
                                            style={{ width: 150 }}
                                            options={nationalityList}
                                            onChange={(value) => setNationality(value)} />

                                    </Item>
                                    <Item
                                        label="Classification"
                                        name={'classification'}
                                    >
                                        <Select
                                            style={{ width: 150 }}
                                            options={classificationNameList}
                                            onChange={(value) => setClassification(value)} />

                                    </Item>
                                </Form>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "10px" }}>
                            <Col>
                                <Form
                                    name="form2"
                                    layout="inline">
                                    <Item
                                        label="Gender"
                                        name={'gender'}
                                    >
                                        <Radio.Group value={"Male"} onChange={(event) => setGender(event.target.value)}>
                                            <Radio value={"All"}>All</Radio>
                                            <Radio value={"Male"}>Male</Radio>
                                            <Radio value={"Female"}>Female</Radio>
                                        </Radio.Group>
                                    </Item>
                                    <Item
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

                                    </Item>
                                </Form>
                            </Col>
                        </Row>
                        <Item>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Item>
                    </Form>
                </div>
                    <div style={{ paddingTop: "10px" }}>
                        {showList &&
                            rows.result.map((row: any, rowIndex: any) => (
                                <Row gutter={16} key={rowIndex}>
                                    {row.map((item: any, columnIndex: any) => (
                                        <Col span={24 / columnsPerRow} key={columnIndex}
                                            style={{ paddingTop: "15px" }}>
                                            <Card
                                                hoverable
                                                style={{ width: 240 }}
                                                cover={<img alt="example" src={item.image} />}
                                            >
                                                <Meta title={item.name} description={item.classification_name} />
                                                <Button style={{ marginTop: '10px' }} onClick={() => handleCardClick(item)}>More Detail</Button>

                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            ))

                        }

                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={wantedList.length}
                            onChange={(page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            }}
                            style={{ paddingTop: "15px" }}
                        />
                        <Modal
                            title="Detalhes da Pessoa"
                            visible={modalVisible}
                            onOk={() => setModalVisible(false)}
                            onCancel={() => setModalVisible(false)}

                        >
                            {selectedPerson && (
                                <div>
                                    <p>Name: {nameSelected}</p>
                                    <p>Nationality: {nationalitySelected}</p>
                                    <p>Classification: {classificationSelected}</p>
                                    <p>Gender: {genderSelected}</p>
                                    <p>Description: {descriptionSelected}</p>
                                </div>
                            )}
                        </Modal>

                    </div></>
            </>
            }
        </>
    )
}

export default SearchPerson;

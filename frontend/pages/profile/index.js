import React, { useEffect, useRef, useState } from 'react';
import data from '@/data/nrc.json';
import ProfileForm from '@/components/profileForm';
import { Toast } from 'primereact/toast';

import { axiosInstance } from '@/utils/axiosInstance';

const EmployeeProfile = () => {
    const toasRef = useRef(null);
    const { nrcLists } = data;
    const [personInfo, setPersonInfo] = useState({
        userID: '',
        RFID: '',
        profileImage: null,
        name: '',
        dateOfBirth: new Date(),
        nationalID: null,
        nationality: '',
        religion: '',
        fatherName: '',
        maritalStatus: false,
        education: '',
        experience: '',
        lastOccupation: '',
        permanentAddress: '',
        currentAddress: '',
        phoneNumber: '',
        frontNationalIDCard: null,
        backNationalIdCard: null,
        criminalClearment: null,
        householdCertificate: null,
        employment_date: new Date(),
        labor_registration_number: '',
        social_security_number: '',
        action: '',
    });
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [frontNationalIDCardUrl, setFrontNationalIDCardUrl] = useState(null);
    const [backNationalIDCardUrl, setBackNationalIDCardUrl] = useState(null);
    const [criminalClearmentUrl, setCriminalClearmentUrl] = useState(null);
    const [householdCertificateUrl, setHouseholdCertificate] = useState(null);
    const [maritalStatusValue, setMaritalStatusValue] = useState(null);
    const imageRef = useRef(null);
    const frontIDRef = useRef(null);
    const backIDRef = useRef(null);
    const criminalRef = useRef(null);
    const householdRef = useRef(null);
    const nrcListCode = [
        {
            en: '1',
            mm: '၁',
        },
        { en: '2', mm: '၂' },
        { en: '3', mm: '၃' },
        { en: '4', mm: '၄' },
        { en: '5', mm: '၅' },
        { en: '6', mm: '၆' },
        { en: '7', mm: '၇' },
        { en: '8', mm: '၈' },
        { en: '9', mm: '၉' },
        { en: '10', mm: '၁၀' },
        { en: '11', mm: '၁၁' },
        { en: '12', mm: '၁၂' },
        { en: '13', mm: '၁၃' },
        { en: '14', mm: '၁၄' },
    ];
    const [nrcListRegion, setNrcListRegion] = useState([]);

    const nrcListCitizen = [
        { en: 'N', mm: 'နိုင်' },
        { en: 'E', mm: 'ဧည့်' },
        { en: 'P', mm: 'ပြု' },
        { en: 'T', mm: 'သာသနာ' },
        { en: 'R', mm: 'ယာယီ' },
        { en: 'S', mm: 'စ' },
    ];

    const [nrcID, setNrcID] = useState({
        nrcCode: nrcListCode[0],
        nrcRegion: '',
        nrcCitizen: nrcListCitizen[0],
        nrcNumber: '',
    });

    const listOfMarital = [
        { name: 'ရှိ', code: 1 },
        { name: 'မရှိ', code: 0 },
    ];

    //  restore Default State
    const restoreDefaultState = data => {
        if (data) {
            setPersonInfo({
                userID: '',
                RFID: '',
                profileImage: null,
                name: '',
                dateOfBirth: new Date(),
                nationalID: null,
                nationality: '',
                religion: '',
                fatherName: '',
                maritalStatus: false,
                education: '',
                experience: '',
                lastOccupation: '',
                permanentAddress: '',
                currentAddress: '',
                phoneNumber: '',
                frontNationalIDCard: null,
                backNationalIdCard: null,
                criminalClearment: null,
                householdCertificate: null,
                employment_date: new Date(),
                labor_registration_number: '',
                social_security_number: '',
            });
        } else {
            setPersonInfo(
                prevState =>
                    ({
                        ...prevState,
                        RFID: '',
                        profileImage: null,
                        name: '',
                        dateOfBirth: new Date(),
                        nationalID: null,
                        nationality: '',
                        religion: '',
                        fatherName: '',
                        maritalStatus: false,
                        education: '',
                        experience: '',
                        lastOccupation: '',
                        permanentAddress: '',
                        currentAddress: '',
                        phoneNumber: '',
                        frontNationalIDCard: null,
                        backNationalIdCard: null,
                        criminalClearment: null,
                        householdCertificate: null,
                        employment_date: new Date(),
                        labor_registration_number: '',
                        social_security_number: '',
                    }) || prevState,
            );
        }

        const result = nrcLists.filter(({ nrc_code }) => nrc_code === nrcListCode[0].en);

        setNrcListRegion(result);

        setNrcID(prevState => ({
            ...prevState,
            nrcCode: nrcListCode[0],
            nrcRegion: result.length ? result[0] : null,
            nrcCitizen: nrcListCitizen[0],
            nrcNumber: '',
        }));
        setProfileImageUrl(null);
        setFrontNationalIDCardUrl(null);
        setBackNationalIDCardUrl(null);
        setCriminalClearmentUrl(null);
        setHouseholdCertificate(null);
        setMaritalStatusValue(null);
        imageRef.current.clear();
        frontIDRef.current.clear();
        backIDRef.current.clear();
        criminalRef.current.clear();
        householdRef.current.clear();
    };

    const submitHandler = async e => {
        e.preventDefault();

        try {
            const value = `${nrcID.nrcCode.mm}/${nrcID.nrcRegion?.name_mm}(${nrcID.nrcCitizen.mm})${nrcID.nrcNumber}`;

            const res = await axiosInstance.post(
                '/profile',
                {
                    employeeID: personInfo.userID,
                    RFID: personInfo.RFID,
                    profile_image: personInfo.profileImage,
                    employee_name: personInfo.name,
                    DOB: personInfo.dateOfBirth,
                    NRC: value,
                    nation: personInfo.nationality,
                    religion: personInfo.religion,
                    father_name: personInfo.fatherName,
                    married: personInfo.maritalStatus,
                    education: personInfo.education,
                    experience: personInfo.experience,
                    last_occupation: personInfo.lastOccupation,
                    permanent_address: personInfo.permanentAddress,
                    current_address: personInfo.currentAddress,
                    phone_number: personInfo.phoneNumber,
                    FNRC_img: personInfo.frontNationalIDCard,
                    BNRC_img: personInfo.backNationalIdCard,
                    recommendation_img: personInfo.criminalClearment,
                    household_chart_img: personInfo.householdCertificate,
                    employment_date: personInfo.employment_date,
                    labor_registration_number: personInfo.labor_registration_number,
                    social_security_number: personInfo.social_security_number,
                },
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            if (res.status === 201) {
                toasRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'This Employee created successfully.',
                });
                restoreDefaultState('submit');
            }
        } catch (error) {
            toasRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something Wrong',
            });
        }
    };

    const updateHandler = async id => {
        try {
            const value = `${nrcID.nrcCode.mm}/${nrcID.nrcRegion?.name_mm}(${nrcID.nrcCitizen.mm})${nrcID.nrcNumber}`;

            const res = await axiosInstance.put(
                `/profile/${id}`,
                {
                    employeeID: personInfo.userID,
                    RFID: personInfo.RFID,
                    profile_image: personInfo.profileImage,
                    employee_name: personInfo.name,
                    DOB: personInfo.dateOfBirth,
                    NRC: value,
                    nation: personInfo.nationality,
                    religion: personInfo.religion,
                    father_name: personInfo.fatherName,
                    married: personInfo.maritalStatus,
                    education: personInfo.education,
                    experience: personInfo.experience,
                    last_occupation: personInfo.lastOccupation,
                    permanent_address: personInfo.permanentAddress,
                    current_address: personInfo.currentAddress,
                    phone_number: personInfo.phoneNumber,
                    FNRC_img: personInfo.frontNationalIDCard,
                    BNRC_img: personInfo.backNationalIdCard,
                    recommendation_img: personInfo.criminalClearment,
                    household_chart_img: personInfo.householdCertificate,
                    employment_date: personInfo.employment_date,
                    labor_registration_number: personInfo.labor_registration_number,
                    social_security_number: personInfo.social_security_number,
                },
                { headers: { 'Content-Type': 'multipart/form-data' } },
            );

            if (res.status === 200) {
                restoreDefaultState('update');
                toasRef.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'This Employee updated successfully.',
                });
            }
        } catch (error) {
            toasRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Something Wrong',
            });
        }
    };

    const onChangeHandler = e => {
        if (e.target.files) {
            setPersonInfo(prevState => {
                return { ...prevState, [e.target.name]: e.target.files[0] };
            });
        } else {
            setPersonInfo(prevState => {
                return { ...prevState, [e.target.name]: e.target.value };
            });
        }
    };

    const onChangeNrcCodeHandler = e => {
        if (!nrcLists) return [];
        const result = nrcLists.filter(item => item.nrc_code === e.target.value.en);
        setNrcListRegion(result);
        setNrcID(prevState => ({
            ...prevState,
            nrcCode: e.target.value,
            nrcRegion: result.length ? result[0] : null,
        }));
    };

    const onChangeNrcHandler = e => {
        setNrcID(prevState => {
            return {
                ...prevState,
                [e.target.name]: e.target.value || e.target.value.name_mm,
            };
        });
    };

    const onSearchHandler = async id => {
        try {
            const res = await axiosInstance.get(`/profile/search?id=${id}`);
            const { data: employee } = res.data;

            if (employee) {
                let url = 'http://127.0.0.1:4000/';

                if (employee) {
                    setPersonInfo(
                        prevState =>
                            ({
                                ...prevState,
                                userID: employee.employeeID,
                                RFID: employee.RFID,
                                profileImage: employee.profile_image,
                                name: employee.employee_name,
                                nationalID: employee.NRC,
                                dateOfBirth: new Date(employee.DOB),
                                nationality: employee.nation,
                                religion: employee.religion,
                                fatherName: employee.father_name,
                                maritalStatus: employee.married,
                                education: employee.education,
                                experience: employee.experience,
                                lastOccupation: employee.last_occupation,
                                permanentAddress: employee.permanent_address,
                                currentAddress: employee.current_address,
                                phoneNumber: employee.phone_number,
                                frontNationalIDCard: employee.FNRC_img,
                                backNationalIdCard: employee.BNRC_img,
                                criminalClearment: employee.recommendation_img,
                                householdCertificate: employee.household_chart_img,
                                employment_date: new Date(employee.employment_date),
                                labor_registration_number: employee.labor_registration_number,
                                social_security_number: employee.social_security_number,
                            }) || prevState,
                    );
                    setProfileImageUrl(() => (employee.profile_image ? url + 'Profile/' + employee.profile_image : null));

                    setFrontNationalIDCardUrl(() => (employee.FNRC_img ? url + 'FNRC/' + employee.FNRC_img : null));

                    setBackNationalIDCardUrl(() => (employee.BNRC_img ? url + 'BNRC/' + employee.BNRC_img : null));

                    setCriminalClearmentUrl(() => (employee.recommendation_img ? url + 'recomendation/' + employee.recommendation_img : null));

                    setHouseholdCertificate(() => (employee.household_chart_img ? url + 'household-chart/' + employee.household_chart_img : null));

                    onSearchSetNRC(employee.NRC);
                    const dropdownResult = listOfMarital.find(marital => marital.code === Number(employee.married));

                    setMaritalStatusValue(dropdownResult);
                }
            }
        } catch (error) {
            toasRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.response?.data?.error,
            });
            restoreDefaultState();
        }
    };

    const onSearchSetNRC = value => {
        if (value) {
            const nrc_code = nrcListCode.find(nrc => nrc.mm === value[0]);
            const nrc_number = value.substring(value.indexOf(')') + 1, value.length);
            const nrc_citizen = nrcListCitizen.find(nrc => nrc.mm === value.slice(value.indexOf('(') + 1, value.indexOf(')')));

            const result = nrcLists.filter(item => item.nrc_code === nrc_code?.en);
            const nrc_region = result.find(nrc => nrc.name_mm === value.slice(value.indexOf('/') + 1, value.indexOf('(')));

            setNrcListRegion(result);

            setNrcID(prevState => ({
                ...prevState,
                nrcCode: nrc_code,
                nrcRegion: nrc_region,
                nrcCitizen: nrc_citizen,
                nrcNumber: nrc_number,
            }));
        }
    };

    useEffect(() => {
        const result = nrcLists.filter(({ nrc_code }) => nrc_code === nrcListCode[0].en);

        setNrcListRegion(result);

        setNrcID(
            prevState =>
                ({
                    ...prevState,
                    nrcCode: nrcListCode[0],
                    nrcRegion: result.length ? result[0] : null,
                    nrcCitizen: nrcListCitizen[0],
                }) || prevState,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex-1'>
            <Toast ref={toasRef} />
            <h1 className='text-3xl underline'>အလုပ်သမားကိုယ်ရေးမှတ်တမ်း</h1>
            <div className='col-12'>
                <ProfileForm
                    imageRef={imageRef}
                    frontIDRef={frontIDRef}
                    backIDRef={backIDRef}
                    criminalRef={criminalRef}
                    householdRef={householdRef}
                    submitHandler={submitHandler}
                    updateHandler={updateHandler}
                    profileImageUrl={profileImageUrl}
                    frontNationalIDCardUrl={frontNationalIDCardUrl}
                    backNationalIDCardUrl={backNationalIDCardUrl}
                    criminalClearmentUrl={criminalClearmentUrl}
                    householdCertificateUrl={householdCertificateUrl}
                    personInfo={personInfo}
                    onChangeHandler={onChangeHandler}
                    onChangeNrcHandler={onChangeNrcHandler}
                    onChangeNrcCodeHandler={onChangeNrcCodeHandler}
                    nrcListCode={nrcListCode}
                    nrcListRegion={nrcListRegion}
                    nrcListCitizen={nrcListCitizen}
                    nrcID={nrcID}
                    maritalStatusValue={maritalStatusValue}
                    listOfMarital={listOfMarital}
                    setProfileImageUrl={setProfileImageUrl}
                    setPersonInfo={setPersonInfo}
                    setMaritalStatusValue={setMaritalStatusValue}
                    onSearchHandler={onSearchHandler}
                    setFrontNationalIDCardUrl={setFrontNationalIDCardUrl}
                    setBackNationalIDCardUrl={setBackNationalIDCardUrl}
                    setCriminalClearmentUrl={setCriminalClearmentUrl}
                    setHouseholdCertificate={setHouseholdCertificate}
                />
            </div>
        </div>
    );
};

export default EmployeeProfile;

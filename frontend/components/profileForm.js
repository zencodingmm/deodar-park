import React from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Image } from "primereact/image";
import { Calendar } from "primereact/calendar";

const ProfileForm = ({
	imageRef,
	frontIDRef,
	backIDRef,
	criminalRef,
	householdRef,
	submitHandler,
	updateHandler,
	profileImageUrl,
	frontNationalIDCardUrl,
	backNationalIDCardUrl,
	criminalClearmentUrl,
	householdCertificateUrl,
	personInfo,
	onChangeHandler,
	onChangeNrcHandler,
	onChangeNrcCodeHandler,
	nrcListCode,
	nrcListRegion,
	nrcListCitizen,
	nrcID,
	maritalStatusValue,
	listOfMarital,
	setProfileImageUrl,
	setPersonInfo,
	setMaritalStatusValue,
	setFrontNationalIDCardUrl,
	setBackNationalIDCardUrl,
	setCriminalClearmentUrl,
	setHouseholdCertificate,
	onSearchHandler,
}) => {
	return (
		<form className="card" onSubmit={submitHandler} encType="multipart/form-data">
			<div className="p-fluid fromgrid grid flex flex-column-reverse md:flex-row">
				<div className="col-12 md:col-6">
					<div className="p-fluid formgrid grid h-full">
						<div className="field col-12">
							<div className="p-inputgroup">
								<label htmlFor="userID" className="p-inputgroup-addon">
									User ID
								</label>
								<InputText type="search" id="userID" name="userID" value={personInfo.userID} onChange={onChangeHandler} required />
								<Button label="Search" type="button" onClick={() => onSearchHandler(personInfo.userID)} />
							</div>
						</div>

						<div className="field col-12">
							<label htmlFor="RFID">RFID</label>
							<InputText id="RFID" name="RFID" type="text" value={personInfo.RFID} onChange={onChangeHandler} required />
						</div>
					</div>
				</div>
				<div className="col-12 md:col-6 flex flex-column justify-content-between align-items-center">
					<div className="w-10rem h-10rem border-2 border-round-xl my-3 overflow-hidden">{profileImageUrl && <Image src={profileImageUrl} alt="hello" width="100%" height="100%" imageStyle={{ objectFit: "cover" }} />}</div>
					<FileUpload
						ref={imageRef}
						mode="basic"
						contentStyle={{ border: "1px solid black", padding: 20 }}
						url={profileImageUrl}
						accept="image/png, image/jpg"
						customUpload
						onSelect={(e) => {
							const file = e.files[0];
							setProfileImageUrl(file.objectURL);
							setPersonInfo((prevState) => {
								return { ...prevState, profileImage: file };
							});
						}}
					/>
				</div>
			</div>
			<div className="p-fluid formgrid grid">
				<div className="field col-12 lg:col-6">
					<label htmlFor="name">အမည်</label>
					<div className="p-inputgroup">
						<InputText id="name" type="text" name="name" value={personInfo.name} onChange={onChangeHandler} required />
					</div>
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="dateOfBirth">မွေးသက္ကရာဇ်</label>
					<Calendar inputId="dateOfBirth" showIcon name="dateOfBirth" value={personInfo.dateOfBirth} onChange={onChangeHandler} dateFormat="yy/mm/dd" maxDate={new Date()} required />
				</div>

				<div className="field col-12">
					<label>နိုင်ငံသားစီစစ်ရေးမှတ်ပုံတင်အမှတ်</label>
					<div className="w-full flex gap-3">
						<div className="field">
							<Dropdown options={nrcListCode} optionLabel="mm" name="nrcCode" value={nrcID.nrcCode} onChange={onChangeNrcCodeHandler} />
						</div>
						<div className="field">
							<Dropdown options={nrcListRegion} optionLabel="name_mm" name="nrcRegion" filter={true} filterInputAutoFocus resetFilterOnHide value={nrcID.nrcRegion} onChange={onChangeNrcHandler} />
						</div>
						<div className="field">
							<Dropdown options={nrcListCitizen} optionLabel="mm" name="nrcCitizen" value={nrcID.nrcCitizen} onChange={onChangeNrcHandler} />
						</div>
						<div className="field w-full">
							<InputText name="nrcNumber" type="text" className="h-full" value={nrcID.nrcNumber} placeholder="မြန်မာလိုရေးရန်" onChange={onChangeNrcHandler} required />
						</div>
					</div>
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="nationality">လူမျိုး</label>
					<InputText id="nationality" name="nationality" type="text" value={personInfo.nationality} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="religion">ဘာသာ</label>
					<InputText id="religion" name="religion" type="text" value={personInfo.religion} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="fatherName">ဖခင်အမည်</label>
					<InputText id="fatherName" name="fatherName" type="text" value={personInfo.fatherName} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="maritalStatus">အိမ်ထောင် ရှိ / မရှိ</label>
					<Dropdown
						inputId="maritalStatus"
						value={maritalStatusValue}
						onChange={(e) => {
							setMaritalStatusValue(e.target.value);
							setPersonInfo((prevState) => {
								return { ...prevState, maritalStatus: e.target.value.code };
							});
						}}
						options={listOfMarital}
						optionLabel="name"
						name="maritalStatus"
						className="w-full"
						placeholder="ရွေးချယ်ရန်"
						required
					/>
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="education">ပညာအရည်အချင်း</label>
					<InputText id="education" name="education" type="text" value={personInfo.education} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="experience">အခြားလုပ်ငန်းအတွေ့အကြုံ</label>
					<InputText id="experience" name="experience" type="text" value={personInfo.experience} onChange={onChangeHandler} />
				</div>

				<div className="field col-12">
					<label htmlFor="lastOccupation">နောက်ဆုံးလုပ်ခဲ့သည့်အလုပ်အကိုင်</label>
					<InputText id="lastOccupation" name="lastOccupation" type="text" value={personInfo.lastOccupation} onChange={onChangeHandler} />
				</div>

				<div className="field col-12">
					<label htmlFor="permanentAddress">အမြဲတမ်းနေရပ်လိပ်စာ</label>
					<InputTextarea id="permanentAddress" name="permanentAddress" type="text" value={personInfo.permanentAddress} onChange={onChangeHandler} rows={3} cols={30} className="max-w-full" autoResize={true} required />
				</div>

				<div className="field col-12">
					<label htmlFor="currentAddress">ယခုနေထိုင်သည့်နေရပ်လိပ်စာ</label>
					<InputTextarea id="currentAddress" name="currentAddress" type="text" value={personInfo.currentAddress} onChange={onChangeHandler} rows={3} cols={30} className="max-w-full w-full" autoResize={true} required />
				</div>

				<div className="field col-12">
					<label htmlFor="phoneNumber">ဆက်သွယ်ရမည့်ဖုန်းနံပါတ်</label>
					<InputText id="phoneNumber" name="phoneNumber" type="tel" value={personInfo.phoneNumber} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label>မှတ်ပုံတင်ရှေ့ခြမ်း</label>

					{frontNationalIDCardUrl && (
						<div className="w-20rem h-10rem">
							<Image
								src={frontNationalIDCardUrl}
								alt="frontNationalIDCard"
								imageStyle={{
									objectFit: "cover",
									width: "100%",
									height: "100%",
								}}
							/>
						</div>
					)}

					<FileUpload
						ref={frontIDRef}
						mode="basic"
						style={{ marginTop: 10 }}
						contentStyle={{ border: "1px solid black", padding: 20 }}
						url="api/upload"
						accept="image/png, image/jpg"
						onSelect={(e) => {
							const file = e.files[0];
							setFrontNationalIDCardUrl(file.objectURL);
							setPersonInfo((prevState) => {
								return { ...prevState, frontNationalIDCard: file };
							});
						}}
					/>
				</div>

				<div className="field col-12 lg:col-6">
					<label>မှတ်ပုံတင်နောက်ခြမ်း</label>
					{backNationalIDCardUrl && (
						<div className="w-20rem h-10rem">
							<Image
								src={backNationalIDCardUrl}
								alt="backNationalIDCard"
								imageStyle={{
									objectFit: "cover",
									width: "100%",
									height: "100%",
								}}
							/>
						</div>
					)}

					<FileUpload
						ref={backIDRef}
						mode="basic"
						style={{ marginTop: 10 }}
						contentStyle={{ border: "1px solid black", padding: 20 }}
						url="api/upload"
						accept="image/png, image/jpg"
						onSelect={(e) => {
							const file = e.files[0];
							setBackNationalIDCardUrl(file.objectURL);
							setPersonInfo((prevState) => {
								return { ...prevState, backNationalIdCard: file };
							});
						}}
					/>
				</div>

				<div className="field col-12 lg:col-6">
					<label>ရဲ / ရပ်ကွက်ထောက်ခံစာ</label>
					{criminalClearmentUrl && (
						<div className="w-20rem h-10rem">
							<Image
								src={criminalClearmentUrl}
								alt="criminalClearment"
								imageStyle={{
									objectFit: "cover",
									width: "100%",
									height: "100%",
								}}
							/>
						</div>
					)}

					<FileUpload
						ref={criminalRef}
						mode="basic"
						style={{ marginTop: 10 }}
						contentStyle={{ border: "1px solid black", padding: 20 }}
						url="api/upload"
						accept="image/png, image/jpg"
						onSelect={(e) => {
							const file = e.files[0];
							setCriminalClearmentUrl(file.objectURL);
							setPersonInfo((prevState) => {
								return { ...prevState, criminalClearment: file };
							});
						}}
					/>
				</div>

				<div className="field col-12 lg:col-6">
					<label>အိမ်ထောင်စုဇယား</label>
					{householdCertificateUrl && (
						<div className="w-20rem h-10rem">
							<Image
								src={householdCertificateUrl}
								alt="householdCertificate"
								imageStyle={{
									objectFit: "cover",
									width: "100%",
									height: "100%",
								}}
							/>
						</div>
					)}

					<FileUpload
						ref={householdRef}
						mode="basic"
						style={{ marginTop: 10 }}
						contentStyle={{ border: "1px solid black", padding: 20 }}
						url="api/upload"
						accept="image/png, image/jpg"
						onSelect={(e) => {
							const file = e.files[0];
							setHouseholdCertificate(file.objectURL);
							setPersonInfo((prevState) => {
								return { ...prevState, householdCertificate: file };
							});
						}}
					/>
				</div>

				<div className="field col-12">
					<label htmlFor="employment_date">အလုပ်ခန့်အပ်သည့်နေ့</label>
					<Calendar inputId="employment_date" name="employment_date" onChange={onChangeHandler} value={personInfo.employment_date} showIcon required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="labor_registration_number">အလုပ်သမားမှတ်ပုံတင်အမှတ်</label>
					<InputText id="labor_registration_number" name="labor_registration_number" type="text" value={personInfo.labor_registration_number} onChange={onChangeHandler} required />
				</div>

				<div className="field col-12 lg:col-6">
					<label htmlFor="social_security_number">လူမှုဖူလုံရေးကိုယ်ပိုင်နံပါတ်</label>
					<InputText id="social_security_number" name="social_security_number" type="text" value={personInfo.social_security_number} onChange={onChangeHandler} required />
				</div>

				<div className="w-full flex justify-content-end px-0 lg:px-8 my-5">
					<div className="flex gap-5">
						<Button label="Update" type="button" severity="warning" onClick={() => updateHandler(personInfo.userID)} />
						<Button label="Submit" type="submit" />
					</div>
				</div>
			</div>
		</form>
	);
};

export default ProfileForm;

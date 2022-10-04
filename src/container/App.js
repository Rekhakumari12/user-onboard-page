import { AppWrapper, Bullet, ProgressBar } from './App.style';
import { useReducer, useState, useMemo } from 'react'
import UserNameInfo from '../pages/UserNameInfo';
import WorkspaceInfo from '../pages/WorkspaceInfo';
import SetupInfo from '../pages/SetupInfo';
import CompleteOnboard from '../pages/CompleteOnboard';
import { reducer } from '../reducer/reducer';
import InitialState from '../InitialState';
import { FormTitles } from '../constants/constants';
import debounce from '../utils/debounce';
import { ReactComponent as Logo } from '../assets/logo.svg'
import generateSteps from '../utils/generateSteps';

function App() {
  const [currentStep, currentSetStep] = useState(1);
  const [data, dispatch] = useReducer(reducer, InitialState);
  const maxSteps = 4
  const steps = useMemo(() => generateSteps(maxSteps), [])
  const handleNext = () => {
    if (currentStep < maxSteps) currentSetStep(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) currentSetStep(prev => prev - 1)
  }
  console.log(currentStep)
  const handleChange = (e) => {
    let { name, value, dataset } = e.target
    if (dataset.setup) value = dataset.setup
    dispatch({ type: name, payload: value })
  }

  const debounceFunction = debounce(handleChange, 300)

  const formDisplay = () => {
    const { userNameInfo, workspaceInfo, setup } = data
    switch (currentStep) {
      case 1:
        return <UserNameInfo
          handleChange={debounceFunction}
          data={userNameInfo} />
      case 2:
        return <WorkspaceInfo
          handleChange={debounceFunction}
          data={workspaceInfo} />
      case 3:
        return <SetupInfo
          handleChange={handleChange}
          data={setup} />
      case 4:
        return <CompleteOnboard
          userName={userNameInfo.name}
          currentStep={currentStep}
          workplaceName={workspaceInfo.name} />
      default:
        return <UserNameInfo
          handleChange={debounceFunction}
          data={userNameInfo} />
    }
  }
  const handleSubmit = () => {
    alert('form submitted!')
    console.log(data)
  }
  const width = 25 * currentStep
  return (
    <AppWrapper>
      <div className='flex justify-center items-center' id="logo">
        <Logo /><h1 className='text-2xl font-bold pl-2'>Eden</h1>
      </div>
      <ProgressBar className='border-solid border border-t-0 w-9/12 m-auto' >
        <div style={{ width: `${width}%` }} className='border-solid border border-t-0'></div>
      </ProgressBar>
      <ul className='flex justify-evenly py-14'>
        {steps.map((step) => {
          return <Bullet key={step} className={`border-solid border-2 rounded-full p-3 ${currentStep >= step ? `active` : ''}`} >
            <span>{step}</span>
          </Bullet>
        })}
      </ul>
      {currentStep === 4 && formDisplay()}
      <div className='formTitle'>
        <h2>{FormTitles[currentStep - 1].text}</h2>
        <span>{FormTitles[currentStep - 1].subtitle}</span>
      </div>
      {currentStep !== 4 && formDisplay()}
      <br />
      <button onClick={currentStep !== FormTitles.length ? handleNext : handleSubmit} className="border p-3 rounded text-white" style={{ backgroundColor: `var(--purple)` }}>
        {currentStep !== FormTitles.length ? `Create Workplace` : `Launch ${data.workspaceInfo.name}`}
      </button>
      {/* <button onClick={handlePrev}>Prev</button> */}
    </AppWrapper >
  );
}

export default App;

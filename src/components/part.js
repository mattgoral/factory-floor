import React from 'react';

const Part = props => {

  function partTestState(state) {
    return state ? 'complete' : 'incomplete';
  }

  return (
    <div className="part">
      <div className="part-name">
        { props.partState.type }
      </div>
      { Object.keys(props.partState.testState).map(test => {
        return (
          <div className="part-test" key={ test }>
            <div className={"part-test-state " + partTestState(props.partState.testState[test])}></div>
            <div className="part-test-name">{ test }</div>
          </div>
        );
      })}
    </div>
  )

}

export default Part;

import { EnzymeAdapter, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() as EnzymeAdapter });

jest.mock('diagrammer/state/common/rootReducer');
jest.mock('diagrammer/state/common/sequenceReducers');
jest.mock('diagrammer/state/layout/layoutReducer');

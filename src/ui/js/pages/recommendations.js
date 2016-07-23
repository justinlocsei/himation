import IndexPage from 'himation/ui/containers/pages';
import RecommendationsPage from 'himation/ui/containers/pages/recommendations';
import { getPrerenderedState, renderPageComponent } from 'himation/ui/rendering';

const state = getPrerenderedState();
const showRecommendations = state.survey ? !state.survey.form.failedValidation : true;
const Page = showRecommendations ? RecommendationsPage : IndexPage;

renderPageComponent(Page);

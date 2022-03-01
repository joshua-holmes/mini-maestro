import Container from "react-bootstrap/Container";
import Title from "./Title";
import Spacer from "./Spacer";

function HowItWorks() {
  
  return (
    <Container>
      <Title>How It Works</Title>
      <h3>Overview</h3>
      <p>Mini Maestro uses the techniques of Counterpoint to guide the user by limiting options avaialbe to them. Instead of being able to place any note on the staff paper, the notes availabe to the user are limited based on the harmonic and melodic context of the current state of the piece. For example, if an F was just placed on the sheet, B would not be available in the list of options to choose from for the following note because that would result in a leap of a tritone, which is not allowed by the contrapuntal (meaning of or in Counterpoint) "rulebook". This program features JavaScript modules written to handle the logic of following these rules and providing viable options to the user, based on those rules. The user then can focus on selecting any note from the availabe list of options and will most likely acheive success in creating a piece that is audibly pleasing, regardless of the user's musical background (or lack thereof).</p>
      <h3>Specific Counterpoint Rules Included</h3>
      <p>Below are a list of specific Counterpoint rules followed in this program. The true list of rules, from the book, <a target="_blank" href="http://www.opus28.co.uk/Fux_Gradus.pdf">"Gradus Ad Parnassum" by Johann Fux</a>, is much lengthier and it would be significantly more difficult and time-consuming to include them all, so I have chosen a select few rules that I deemed important:</p>
      <h4>Harmonic</h4>
      <ul>
        <li>Vocing: Voices may not pass each other. For example the alto cannot rise higher than the soprano on any given beat.</li>
        <li>Harmony: Each note must fall within the harmony of the piece. Harmonies are determined by the harmonic context created by the other voices on any given beat, as well as <a target="_blank" href="https://www.musicnotes.com/now/wp-content/uploads/1-3.png">acceptable chord progressions</a> from beat to beat.</li>
        <li>Parallel harmony: Perfect 5ths and octaves may not move in parallel motion. For example, if alto is on middle C and soprano is an octave higher, they may not both move in the same interval (e.g. down a step), instead they must move in different intervals. Soprano moving down 3 steps and alto moving down 1 step would be acceptable, for example.</li>
        <li>Similar harmony: Similar motion into perfect intervals (5ths and octaves) is not allowed. If two voices are moving into a perfect interval from each other, they must move in contrary motion - one moves up and one moves down.</li>
        <li>Dissonant harmony: Dissonant harmonies (2nds, 4ths, and 7ths) between soprano and bass are disallowed. In 2-part harmony, all dissonant harmonies are disallowed, but in 4-part harmony, this is ok between inner voices.</li>
        <li>Bass notes: The first and last notes in the bass line must be the root of the chord.</li>
        <li>Soprano leading tone: If the soprano's second to last note is B, the last note must be C. This is because B is the leading tone and the leading tone should always go up. In 4-part harmony, it is still recommended that leading tones go up, but it is only required in the soprano, especially at the end of the piece, because the soprano is more exposed.</li>
      </ul>
      <h4>Melodic</h4>
      <ul>
        <li>Range: Each voice cannot travel outside it's acceptable range.</li>
        <li>Tritone runs: A voice may not melodically outline a tritone (an interval exactly 6 half-steps away). In otherwords, if a voice has F, G, A, B, the following note cannot be A, because moving from F to B and back down would outline a tritone.</li>
        <li>Tritone skips: A voice may not leap in an interval of a tritone. For example, a voice cannot skip from a B to an F or vice versa.</li>
        <li>Large skips: A voice may not skip in intervals greater than an octave.</li>
        <li>After skips: After a voice skips in any direction, it must then either step in the opposite direction or remain on the same note (unison).</li>
      </ul>
      <Spacer />
    </Container>
  )
}

export default HowItWorks;
import '../models/beat.dart';

List<Beat> generateBeats() {
  final beats = <Beat>[
    Beat(
      id: 0,
      name: 'Beat',
      url: 'https://www.gadgetchespaccano.it/beat2025/beat.mp3',
    ),
  ];

  for (var i = 1; i <= 260; i++) {
    beats.add(
      Beat(
        id: i,
        name: 'Beat $i',
        url: 'https://www.gadgetchespaccano.it/beat2025/beat$i.mp3',
      ),
    );
  }

  return beats;
}

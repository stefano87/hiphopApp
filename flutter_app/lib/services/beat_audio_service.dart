import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';

import '../models/beat.dart';

class BeatAudioService extends ChangeNotifier {
  final AudioPlayer _player = AudioPlayer();
  Beat? _currentBeat;
  double _volume = 1.0;

  Beat? get currentBeat => _currentBeat;
  bool get isPlaying => _player.playing;
  double get volume => _volume;

  BeatAudioService() {
    _player.playerStateStream.listen((state) {
      if (state.processingState == ProcessingState.completed) {
        _clearPlayingState();
      }
      notifyListeners();
    });
  }

  Future<void> playBeat(Beat beat, {double? volume}) async {
    if (_currentBeat?.id == beat.id && _player.playing) {
      await stop();
      return;
    }

    _currentBeat = beat;
    if (volume != null) {
      _volume = volume;
    }
    try {
      await _player.setVolume(_volume);
      await _player.setUrl(beat.url);
      unawaited(_player.play());
      notifyListeners();
    } catch (e) {
      debugPrint('Error playing beat: $e');
      rethrow;
    }
  }

  /// Beat during recording.
  /// IMPORTANT: just_audio's play() future only completes when playback
  /// ENDS/stops, so we must NOT await it or the caller hangs forever
  /// ("Loading beat..." stuck). We load the URL, fire play(), and return.
  Future<bool> playBeatForRecording(Beat beat, {double volume = 0.55}) async {
    _currentBeat = beat;
    _volume = volume;
    try {
      await _player.stop();
      await _player.setVolume(volume);
      await _player.setUrl(beat.url);
      unawaited(_player.play());
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('playBeatForRecording error: $e');
      return false;
    }
  }

  Future<void> setVolume(double value) async {
    _volume = value.clamp(0.0, 1.0);
    await _player.setVolume(_volume);
    notifyListeners();
  }

  Future<void> resetVolume() async {
    _volume = 1.0;
    await _player.setVolume(_volume);
    notifyListeners();
  }

  Future<void> stop() async {
    await _player.stop();
    _clearPlayingState();
    notifyListeners();
  }

  /// Play a local audio file (recording playback).
  /// Returns true if playback started successfully.
  Future<bool> playLocalFile(String path) async {
    try {
      await _player.stop();
      _currentBeat = null;
      await _player.setVolume(1.0);
      _volume = 1.0;
      await _player.setFilePath(path);
      unawaited(_player.play());
      notifyListeners();
      return true;
    } catch (e) {
      debugPrint('playLocalFile error: $e');
      return false;
    }
  }

  Stream<PlayerState> get playerStateStream => _player.playerStateStream;

  void _clearPlayingState() {
    _currentBeat = null;
  }

  bool isBeatPlaying(Beat beat) =>
      _currentBeat?.id == beat.id && _player.playing;

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}

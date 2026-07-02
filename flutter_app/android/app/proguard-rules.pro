# Flutter
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-dontwarn io.flutter.embedding.**

# Google Mobile Ads
-keep class com.google.android.gms.ads.** { *; }

# Meta Audience Network (AdMob mediation adapter)
-keep class com.facebook.ads.** { *; }
-keep class com.google.ads.mediation.facebook.** { *; }
-dontwarn com.facebook.ads.**

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

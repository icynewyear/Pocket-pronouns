export const GRADLE_KTS_CODE = `// app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    id("kotlin-kapt") // For Room code generation
}

android {
    namespace = "com.example.pronounpocket"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.pronounpocket"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // Jetpack Compose M3
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.7.7")

    // Room Persistent Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    kapt("androidx.room:room-compiler:$roomVersion")

    // Lifecycle VM & StateFlow
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.7.0")

    // Tests
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.02.00"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`;

export const THEME_KOTLIN_CODE = `// ui/theme/Color.kt
package com.example.pronounpocket.ui.theme

import androidx.compose.ui.graphics.Color

// Inclusive Pastel Palette supporting light & dark modes with high accessibility
val WarmCream = Color(0xFFFDFBF7)
val DeepSlate = Color(0xFF1E293B)
val PastelLavender = Color(0xFFEEF2FF)
val DeepIndigo = Color(0xFF4338CA)
val LightIndigo = Color(0xFFE0E7FF)

val SoftPurple = Color(0xFFF5F3FF)
val ActivePurple = Color(0xFF8B5CF6)
val SoftEmerald = Color(0xFFECFDF5)
val ActiveEmerald = Color(0xFF10B981)

val Charcoal = Color(0xFF0F172A)
val SoftGray = Color(0xFFF1F5F9)

// ui/theme/Type.kt
package com.example.pronounpocket.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 22.sp,
        letterSpacing = (-0.5).sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        letterSpacing = 0.5.sp
    )
)

// ui/theme/Theme.kt
package com.example.pronounpocket.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = DeepIndigo,
    onPrimary = Color.White,
    primaryContainer = LightIndigo,
    secondary = ActivePurple,
    background = WarmCream,
    surface = Color.White,
    onBackground = Charcoal,
    onSurface = Charcoal
)

@Composable
fun PronounPocketTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme // Strict warm palette for accessibility as requested

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}`;

export const ROOM_DB_CODE = `// data/PronounSet.kt
package com.example.pronounpocket.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "pronoun_sets")
data class PronounSet(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val subject: String,      // e.g. "ze"
    val objectPronoun: String, // e.g. "zir"
    val possessiveDet: String, // e.g. "zir"
    val possessivePro: String, // e.g. "zirs"
    val reflexive: String,    // e.g. "zirself"
    val isCustom: Boolean = true,
    val isMastered: Boolean = false,
    val reviewCount: Int = 0,
    val notes: String = "",
    // Attempt tracking counters for the 5 forms to meet mastery threshold (e.g. 3 attempts each)
    val correctAttemptsSubject: Int = 0,
    val correctAttemptsObject: Int = 0,
    val correctAttemptsPossessiveDet: Int = 0,
    val correctAttemptsPossessivePro: Int = 0,
    val correctAttemptsReflexive: Int = 0
)

// data/PronounDao.kt
package com.example.pronounpocket.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface PronounDao {
    @Query("SELECT * FROM pronoun_sets ORDER BY isMastered ASC, id DESC")
    fun getAllPronounSets(): Flow<List<PronounSet>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPronounSet(pronounSet: PronounSet)

    @Update
    suspend fun updatePronounSet(pronounSet: PronounSet)

    @Delete
    suspend fun deletePronounSet(pronounSet: PronounSet)

    @Query("SELECT COUNT(*) FROM pronoun_sets WHERE isMastered = 1")
    fun getMasteredCount(): Flow<Int>
}

// data/PronounDatabase.kt
package com.example.pronounpocket.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(entities = [PronounSet::class], version = 1, exportSchema = false)
abstract class PronounDatabase : RoomDatabase() {
    abstract fun pronounDao(): PronounDao

    companion object {
        @Volatile
        private var INSTANCE: PronounDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): PronounDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    PronounDatabase::class.java,
                    "pronoun_pocket_database"
                )
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
                instance
            }
        }
    }

    private class DatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    val dao = database.pronounDao()
                    // Seed initial neopronouns out of the box
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "ze", objectPronoun = "zir", possessiveDet = "zir",
                            possessivePro = "zirs", reflexive = "zirself", isCustom = false,
                            notes = "Originated in late 20th century. Pronounced zee, zere, zers."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "xe", objectPronoun = "xem", possessiveDet = "xyr",
                            possessivePro = "xyrs", reflexive = "xemself", isCustom = false,
                            notes = "Highly popular neutral pronoun set. Pronounced zey, zem, zere."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "fae", objectPronoun = "faer", possessiveDet = "faer",
                            possessivePro = "faers", reflexive = "faerself", isCustom = false,
                            notes = "Noun-self set with thematic connections to nature."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "ey", objectPronoun = "em", possessiveDet = "eir",
                            possessivePro = "eirs", reflexive = "emself", isCustom = false,
                            notes = "Spivak pronouns, created by Michael Spivak in 1990."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "ve", objectPronoun = "ver", possessiveDet = "vis",
                            possessivePro = "vis", reflexive = "verself", isCustom = false,
                            notes = "Created by Hulda Regehr Clark in 1970."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "ne", objectPronoun = "nem", possessiveDet = "nir",
                            possessivePro = "nirs", reflexive = "nemself", isCustom = false,
                            notes = "Popularized by science fiction novels."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "per", objectPronoun = "per", possessiveDet = "per",
                            possessivePro = "pers", reflexive = "perself", isCustom = false,
                            notes = "Short for person, from Marge Piercy's novel 'Woman on the Edge of Time'."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "sie", objectPronoun = "hir", possessiveDet = "hir",
                            possessivePro = "hirs", reflexive = "hirself", isCustom = false,
                            notes = "German-influenced pronoun set blending see and here."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "ae", objectPronoun = "aer", possessiveDet = "aer",
                            possessivePro = "aers", reflexive = "aerself", isCustom = false,
                            notes = "A futuristic pronoun set common in speculative fiction."
                        )
                    )
                    dao.insertPronounSet(
                        PronounSet(
                            subject = "thon", objectPronoun = "thon", possessiveDet = "thons",
                            possessivePro = "thons", reflexive = "thonself", isCustom = false,
                            notes = "Created in 1884 as a contraction of 'that one'."
                        )
                    )
                }
            }
        }
    }
}`;

export const VIEWMODEL_CODE = `// ui/PronounViewModel.kt
package com.example.pronounpocket.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.pronounpocket.data.PronounDatabase
import com.example.pronounpocket.data.PronounSet
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class PracticeSentence(
    val template: String,
    val type: String // "subject", "object", "possessiveDet", "possessivePro", "reflexive"
)

class PronounViewModel(application: Application) : AndroidViewModel(application) {
    private val db = PronounDatabase.getDatabase(application, viewModelScope)
    private val dao = db.pronounDao()

    // Stream state to Compose UI securely
    val pronounSets: StateFlow<List<PronounSet>> = dao.getAllPronounSets()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val masteredCount: StateFlow<Int> = dao.getMasteredCount()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    // Flashcard session queue states
    private val _sessionDeck = MutableStateFlow<List<Pair<PronounSet, PracticeSentence>>>(emptyList())
    val sessionDeck: StateFlow<List<Pair<PronounSet, PracticeSentence>>> = _sessionDeck.asStateFlow()

    private val _currentCardIndex = MutableStateFlow(0)
    val currentCardIndex: StateFlow<Int> = _currentCardIndex.asStateFlow()

    private val _streakCount = MutableStateFlow(0)
    val streakCount: StateFlow<Int> = _streakCount.asStateFlow()

    private val sentenceTemplates = listOf(
        PracticeSentence("___ is going to the local library today.", "subject"),
        PracticeSentence("___ loves coding offline-first applications.", "subject"),
        PracticeSentence("The teacher asked ___ to answer the question.", "object"),
        PracticeSentence("I want to invite ___ to join our practice session.", "object"),
        PracticeSentence("This is ___ newly designed notebook.", "possessiveDet"),
        PracticeSentence("We admire ___ commitment to normalizing inclusive language.", "possessiveDet"),
        PracticeSentence("The creative choice was entirely ___.", "possessivePro"),
        PracticeSentence("I bought this book thinking it was ___.", "possessivePro"),
        PracticeSentence("Ze decided to reward ___ with a break.", "reflexive"),
        PracticeSentence("Fae cooked a wonderful meal for ___.", "reflexive")
    )

    init {
        // Generate deck as soon as pronoun list loads
        viewModelScope.launch {
            pronounSets.collect { list ->
                if (list.isNotEmpty() && _sessionDeck.value.isEmpty()) {
                    generateSessionDeck()
                }
            }
        }
    }

    fun generateSessionDeck() {
        val list = pronounSets.value
        if (list.isEmpty()) return
        
        val deck = mutableListOf<Pair<PronounSet, PracticeSentence>>()
        list.forEach { set ->
            val shuffledSentences = sentenceTemplates.shuffled().take(2)
            shuffledSentences.forEach { sentence ->
                deck.add(Pair(set, sentence))
            }
        }
        _sessionDeck.value = deck.shuffled()
        _currentCardIndex.value = 0
    }

    val REQUIRED_CORRECT_ATTEMPTS = 3

    fun recordCardAnswer(correct: Boolean) {
        val currentDeck = _sessionDeck.value
        val index = _currentCardIndex.value
        if (currentDeck.isEmpty() || index >= currentDeck.size) return

        val activeItem = currentDeck[index]
        val testedForm = activeItem.second.type
        
        viewModelScope.launch {
            val oldSet = activeItem.first
            
            // Increment the specific form counter if correct, capped at REQUIRED_CORRECT_ATTEMPTS
            var newSubj = oldSet.correctAttemptsSubject
            var newObj = oldSet.correctAttemptsObject
            var newPossDet = oldSet.correctAttemptsPossessiveDet
            var newPossPro = oldSet.correctAttemptsPossessivePro
            var newRefl = oldSet.correctAttemptsReflexive
            
            if (correct) {
                when (testedForm) {
                    "subject" -> newSubj = (newSubj + 1).coerceAtMost(REQUIRED_CORRECT_ATTEMPTS)
                    "object" -> newObj = (newObj + 1).coerceAtMost(REQUIRED_CORRECT_ATTEMPTS)
                    "possessiveDet" -> newPossDet = (newPossDet + 1).coerceAtMost(REQUIRED_CORRECT_ATTEMPTS)
                    "possessivePro" -> newPossPro = (newPossPro + 1).coerceAtMost(REQUIRED_CORRECT_ATTEMPTS)
                    "reflexive" -> newRefl = (newRefl + 1).coerceAtMost(REQUIRED_CORRECT_ATTEMPTS)
                }
            }
            
            val allMastered = (newSubj >= REQUIRED_CORRECT_ATTEMPTS &&
                               newObj >= REQUIRED_CORRECT_ATTEMPTS &&
                               newPossDet >= REQUIRED_CORRECT_ATTEMPTS &&
                               newPossPro >= REQUIRED_CORRECT_ATTEMPTS &&
                               newRefl >= REQUIRED_CORRECT_ATTEMPTS)
                               
            val updatedSet = oldSet.copy(
                reviewCount = oldSet.reviewCount + 1,
                correctAttemptsSubject = newSubj,
                correctAttemptsObject = newObj,
                correctAttemptsPossessiveDet = newPossDet,
                correctAttemptsPossessivePro = newPossPro,
                correctAttemptsReflexive = newRefl,
                isMastered = allMastered
            )
            dao.updatePronounSet(updatedSet)
            
            if (correct) {
                _streakCount.value += 1
            } else {
                _streakCount.value = 0
            }

            // Move to next card
            if (index < currentDeck.size - 1) {
                _currentCardIndex.value += 1
            } else {
                // Deck finished, reload
                generateSessionDeck()
            }
        }
    }

    // CRUD Database Mutators
    fun addPronounSet(
        subject: String,
        objectPronoun: String,
        possessiveDet: String,
        possessivePro: String,
        reflexive: String,
        notes: String
    ) {
        viewModelScope.launch {
            dao.insertPronounSet(
                PronounSet(
                    subject = subject.lowercase().trim(),
                    objectPronoun = objectPronoun.lowercase().trim(),
                    possessiveDet = possessiveDet.lowercase().trim(),
                    possessivePro = possessivePro.lowercase().trim(),
                    reflexive = reflexive.lowercase().trim(),
                    notes = notes.trim()
                )
            )
            generateSessionDeck()
        }
    }

    fun deleteSet(pronounSet: PronounSet) {
        viewModelScope.launch {
            dao.deletePronounSet(pronounSet)
            generateSessionDeck()
        }
    }
}`;

export const COMPOSE_UI_CODE = `// ui/Screens.kt
package com.example.pronounpocket.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.pronounpocket.data.PronounSet

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppContainer(viewModel: PronounViewModel) {
    var selectedTab by remember { mutableStateOf(0) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("PronounPocket", fontWeight = FontWeight.Black) },
                colors = TopAppBarDefaults.topBarColorScheme(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    icon = { Icon(Icons.Default.School, contentDescription = "Study") },
                    label = { Text("Study") }
                )
                NavigationBarItem(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = "Library") },
                    label = { Text("Library") }
                )
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            if (selectedTab == 0) {
                StudyScreen(viewModel)
            } else {
                LibraryScreen(viewModel)
            }
        }
    }
}

@Composable
fun StudyScreen(viewModel: PronounViewModel) {
    val deck by viewModel.sessionDeck.collectAsState()
    val currentIndex by viewModel.currentCardIndex.collectAsState()
    val streak by viewModel.streakCount.collectAsState()

    if (deck.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Please add a pronoun set in the Library to start studying!", textAlign = TextAlign.Center)
        }
        return
    }

    val activeCard = deck.getOrNull(currentIndex) ?: return
    val pronounSet = activeCard.first
    val sentence = activeCard.second

    var rotated by remember { mutableStateOf(false) }
    val rotation by animateFloatAsState(
        targetValue = if (rotated) 180f else 0f,
        animationSpec = tween(durationMillis = 500)
    )

    // Reset card flip when card index changes
    LaunchedEffect(currentIndex) {
        rotated = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Upper stats row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Card \${currentIndex + 1} of \${deck.size}", style = MaterialTheme.typography.labelMedium)
            Text("Streak: \${streak} 🔥", style = MaterialTheme.typography.labelMedium)
        }

        // Animated Flip Card container
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(320.dp)
                .graphicsLayer {
                    rotationY = rotation
                    cameraDistance = 8 * density
                }
                .clickable { rotated = !rotated },
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                if (rotation <= 90f) {
                    // FRONT OF THE CARD
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Text(
                            "CONTEXT: \${sentence.type.uppercase()}",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            sentence.template.replace("___", "_______"),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Medium,
                            textAlign = TextAlign.Center,
                            lineHeight = 30.sp
                        )
                        Text(
                            "Target: \${pronounSet.subject} / \${pronounSet.objectPronoun}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                } else {
                    // BACK OF THE CARD
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier
                            .fillMaxSize()
                            .graphicsLayer { rotationY = 180f } // Counteract vertical rotation
                    ) {
                        Text(
                            "SOLUTION REVEALED",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.secondary
                        )
                        
                        val correctValue = when(sentence.type) {
                            "subject" -> pronounSet.subject
                            "object" -> pronounSet.objectPronoun
                            "possessiveDet" -> pronounSet.possessiveDet
                            "possessivePro" -> pronounSet.possessivePro
                            "reflexive" -> pronounSet.reflexive
                            else -> pronounSet.subject
                        }

                        Text(
                            sentence.template.replace("___", correctValue.uppercase()),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center,
                            lineHeight = 30.sp,
                            color = MaterialTheme.colorScheme.primary
                        )

                        Text(
                            "Conjugation Form: \${correctValue}",
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }

        // Practice feedback actions
        if (!rotated) {
            Button(
                onClick = { rotated = true },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.Refresh, contentDescription = "Check")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Check Answer", fontWeight = FontWeight.Bold)
            }
        } else {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Button(
                    onClick = { viewModel.recordCardAnswer(false) },
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.errorContainer,
                        contentColor = MaterialTheme.colorScheme.onErrorContainer
                    )
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Wrong")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Got It Wrong")
                }

                Button(
                    onClick = { viewModel.recordCardAnswer(true) },
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    )
                ) {
                    Icon(Icons.Default.Check, contentDescription = "Right")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Got It Right")
                }
            }
        }
    }
}

@Composable
fun LibraryScreen(viewModel: PronounViewModel) {
    val sets by viewModel.pronounSets.collectAsState()
    val masteredCount by viewModel.masteredCount.collectAsState()
    var isDialogOpen by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { isDialogOpen = true }) {
                Icon(Icons.Default.Add, contentDescription = "Add Custom Set")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Mastery Tracker", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text("You have mastered \${masteredCount} out of \${sets.size} neopronouns.", fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(sets) { set ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("\${set.subject} / \${set.objectPronoun}", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                Text("\${set.possessiveDet} / \${set.possessivePro} / \${set.reflexive}", fontSize = 12.sp)
                                if (set.notes.isNotEmpty()) {
                                    Text(set.notes, fontSize = 11.sp, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.outline)
                                }
                            }
                            IconButton(onClick = { viewModel.deleteSet(set) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete Set", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }
        }
    }

    if (isDialogOpen) {
        CustomAddDialog(
            onDismiss = { isDialogOpen = false },
            onSave = { s, o, pd, pp, r, n ->
                viewModel.addPronounSet(s, o, pd, pp, r, n)
                isDialogOpen = false
            }
        )
    }
}

@Composable
fun CustomAddDialog(
    onDismiss: () -> Unit,
    onSave: (String, String, String, String, String, String) -> Unit
) {
    var subject by remember { mutableStateOf("") }
    var objectPronoun by remember { mutableStateOf("") }
    var possessiveDet by remember { mutableStateOf("") }
    var possessivePro by remember { mutableStateOf("") }
    var reflexive by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            shape = RoundedCornerShape(24.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .background(MaterialTheme.colorScheme.surface),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Add Custom Neopronoun Set", fontWeight = FontWeight.Black, fontSize = 18.sp)
                
                OutlinedTextField(value = subject, onValueChange = { subject = it }, label = { Text("Subject (e.g. ze)") })
                OutlinedTextField(value = objectPronoun, onValueChange = { objectPronoun = it }, label = { Text("Object (e.g. zir)") })
                OutlinedTextField(value = possessiveDet, onValueChange = { possessiveDet = it }, label = { Text("Possessive Det (e.g. zir)") })
                OutlinedTextField(value = possessivePro, onValueChange = { possessivePro = it }, label = { Text("Possessive Pro (e.g. zirs)") })
                OutlinedTextField(value = reflexive, onValueChange = { reflexive = it }, label = { Text("Reflexive (e.g. zirself)") })
                OutlinedTextField(value = notes, onValueChange = { notes = it }, label = { Text("Usage Notes") })

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = onDismiss) { Text("Cancel") }
                    Button(onClick = { onSave(subject, objectPronoun, possessiveDet, possessivePro, reflexive, notes) }) {
                        Text("Add Set")
                    }
                }
            }
        }
    }
}`;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "enteredBy" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "serviceAttendance" TEXT NOT NULL,
    "isMember" BOOLEAN NOT NULL,
    "membershipCode" TEXT,
    "isRegularVisitor" BOOLEAN,
    "hasChildren" BOOLEAN NOT NULL,
    "childrenDepartments" TEXT NOT NULL,
    "overallRating" TEXT NOT NULL,
    "transitionSmooth" TEXT NOT NULL,
    "enjoyMost" TEXT NOT NULL DEFAULT '',
    "improveAspects" TEXT NOT NULL DEFAULT '',
    "timesConvenient" BOOLEAN NOT NULL,
    "timeSuggestions" TEXT,
    "departmentsInvolved" TEXT NOT NULL DEFAULT '',
    "departmentActivity" TEXT NOT NULL,
    "departmentEffectiveness" TEXT NOT NULL,
    "departmentImprovements" TEXT NOT NULL DEFAULT '',
    "ministriesServing" TEXT NOT NULL DEFAULT '',
    "ministryTeamwork" TEXT NOT NULL,
    "ministrySupport" TEXT NOT NULL,
    "ministryImprovements" TEXT NOT NULL DEFAULT '',
    "spiritualAtmosphere" TEXT NOT NULL,
    "exceptionalAreas" TEXT NOT NULL DEFAULT '',
    "urgentImprovements" TEXT NOT NULL DEFAULT '',
    "additionalThoughts" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Response_createdAt_idx" ON "Response"("createdAt");

-- CreateIndex
CREATE INDEX "Response_enteredBy_idx" ON "Response"("enteredBy");

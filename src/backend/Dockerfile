FROM mcr.microsoft.com/dotnet/sdk:9.0-bookworm-slim AS build
WORKDIR /src

COPY *.sln* ./
COPY TutoringCRM.API/*.csproj ./TutoringCRM.API/
COPY TutoringCRM.Application/*.csproj ./TutoringCRM.Application/
COPY TutoringCRM.Domain/*.csproj ./TutoringCRM.Domain/
COPY TutoringCRM.Infrastructure/*.csproj ./TutoringCRM.Infrastructure/

RUN dotnet restore

COPY . .
WORKDIR /src/TutoringCRM.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TutoringCRM.API.dll"]